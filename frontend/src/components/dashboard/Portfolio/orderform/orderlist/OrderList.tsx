import { AssetsItem, PortfolioData, PortfolioHoldings, PortfolioHoldingsDifference } from "@/lib/types";
import PortfolioBreakdownCard from "../../PortfolioBreakdownCard";
import ChangeList from "./ChangeList";
import { Button } from "@/components/ui/button";
// import { Link } from "next-view-transitions";
import Link from "next/link";
import {useTransitionRouter} from 'next-view-transitions'

interface OrderListProps {
    data: PortfolioData;
    newOrders: AssetsItem[];
}

export default function OrderList({ data, newOrders } : OrderListProps) {
    const router = useTransitionRouter();

    // Helper function to calculate the final portfolio holdings
    const calculateFinalOrders = (oldOrders: PortfolioHoldings[], newOrders: AssetsItem[]): PortfolioHoldingsDifference[] => {
        // Create a map to hold the final orders
        const finalOrdersMap = new Map<string, PortfolioHoldingsDifference>();

        // Add old orders to the map
        oldOrders.forEach(order => {
            finalOrdersMap.set(order.ticker, { ...order, difference: 0 });
        });

        // Process new orders and update the map accordingly
        newOrders.forEach(newOrder => {
            const existingOrder = finalOrdersMap.get(newOrder.ticker);

            if (existingOrder) {
                // If the order exists, update the position based on the orderType
                if (newOrder.orderType === "Buy") {
                    existingOrder.position += newOrder.position;
                    existingOrder.difference += 1;
                } else if (newOrder.orderType === "Sell") {
                    existingOrder.position -= newOrder.position;
                    existingOrder.difference -= 1;
                }

                // Update the market value based on the new position and cost
                existingOrder.market = existingOrder.position * newOrder.cost;
            } else {
                // If the order does not exist, add it to the map
                finalOrdersMap.set(newOrder.ticker, {
                    name: newOrder.name,
                    ticker: newOrder.ticker,
                    type: newOrder.type,
                    geography: newOrder.geography,
                    position: newOrder.position,
                    market: newOrder.market,
                    last: newOrder.last,
                    cost: newOrder.cost,
                    PL: 0, // Set PL to 0 as a placeholder
                    dailyPL: 0, // Set dailyPL to 0 as a placeholder
                    positionsRatio: 0, // Set positionsRatio to 0 as a placeholder
                    difference: newOrder.orderType === "Buy" ? 1 : -1 // Set difference based on order type
                });
            }
        });

        // Convert the map back to an array
        const finalOrders = Array.from(finalOrdersMap.values());

        // Calculate the total market value of the portfolio
        const totalMarketValue = finalOrders.reduce((total, order) => total + order.market, 0);

        // Update positionsRatio for each asset
        finalOrders.forEach(order => {
            order.positionsRatio = (order.market / totalMarketValue) * 100;
        });

        return finalOrders;
    }

    const handleSubmit = () => {
        // Submit to backend to update portfolio
    }

    const finalOrders = calculateFinalOrders(data.portfolioHoldings, newOrders);

    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <h1 className="text-3xl font-semibold">Changes</h1>
            <ChangeList oldOrders={data.portfolioHoldings} newOrders={finalOrders} />
            <div className="flex gap-2 mt-4">
                <Button className="bg-red-500" onClick={handleSubmit}>Confirm Orders</Button>
                <Link 
                    href={{
                        pathname: `/dashboard/${data.portfolioId}/neworder`,
                        query: { orders: JSON.stringify(newOrders) },
                    }}
                >
                    <Button className="bg-gray-400">Cancel</Button>
                </Link>
                {/* <Button className="bg-gray-400 text-white" onClick={(e) => {
                    e.preventDefault()
                    router.back()
                    }}
                >
                    Cancel
                </Button> */}
            </div>
        </div>
    )
}