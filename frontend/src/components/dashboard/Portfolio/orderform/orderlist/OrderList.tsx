import { Alert, AssetsItem, CreateOrderItem, PortfolioData, PortfolioHoldings, PortfolioHoldingsDifference, RuleReport } from "@/lib/types";
import ChangeList from "./ChangeList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SecuritiesChart from "../../charts/SecuritiesChart";
import TriggeredAlert from "../../TriggeredAlert";
import { createMultipleOrders } from "@/api/order";
import { useTransitionRouter } from "next-view-transitions";
import { createOrdersTransaction } from "@/api/transaction";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderListProps {
    data: PortfolioData;
    newOrders: AssetsItem[];
    triggeredAlerts: Alert[];
    ruleReport: RuleReport;
}

export default function OrderList({ data, newOrders, triggeredAlerts, ruleReport } : OrderListProps) {
    const router = useTransitionRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

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
                    totalPL: 0, // Set PL to 0 as a placeholder
                    dailyPL: 0, // Set dailyPL to 0 as a placeholder
                    positionsRatio: 0, // Set positionsRatio to 0 as a placeholder
                    difference: newOrder.orderType === "Buy" ? 1 : -1 // Set difference based on order type
                });
            }
        });

        // Convert the map back to an array
        const finalOrders = Array.from(finalOrdersMap.values());

        return finalOrders;
    }

    // TODO: Add loader here
    const handleSubmit = async () => {
        setLoading(true);
        // Submit to backend to update orders db with newOrders
        const formattedOrders: CreateOrderItem[] = newOrders.map((order) => ({
            orderType: order.orderType.toUpperCase(),
            assetName: order.ticker,
            quantity: Number(order.position),
            price: Number(order.cost),
            portfolioId: data.portfolioId,
        }));
        console.log(formattedOrders);

        try {
            const result = await createOrdersTransaction(data.portfolioId, formattedOrders);
            console.log("Orders created successfully: ", result);
            // Navigate back to the dashboard after successful submission
            toast({
                title: `Orders Sent!`,
                description: `Orders have been added to the orderbook successfully, you will now be redirected back to the dashboard`,
            });
            setLoading(false);
            router.push(`/dashboard/${data.portfolioId}`);
        } catch (error) {
            console.error("Failed to create orders: ", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request: ${error}`,
            });
        }
    }

    const finalOrders = calculateFinalOrders(data.portfolioHoldings, newOrders);

    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <div className="grid grid-cols-2">
                <SecuritiesChart data={data.portfolioBreakdown.securities} />
                <TriggeredAlert type="orderForm" data={triggeredAlerts} ruleReport={ruleReport} />
            </div>
            <h1 className="text-2xl font-semibold">Changes</h1>
            <ChangeList oldOrders={data.portfolioHoldings} newOrders={finalOrders} />
            <div className="flex gap-2 mt-4">
                {loading ? 
                    <Button className="bg-red-500 hover:bg-red-800" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming Orders
                    </Button>
                : 
                    <Button className="bg-red-500 hover:bg-red-800" onClick={handleSubmit}>Confirm Orders</Button>
                }
                <Link 
                    href={{
                        pathname: `/dashboard/${data.portfolioId}/neworder`,
                        query: { orders: JSON.stringify(newOrders) },
                    }}
                >
                    <Button className="bg-gray-400">Back to Order List</Button>
                </Link>
            </div>
        </div>
    )
}