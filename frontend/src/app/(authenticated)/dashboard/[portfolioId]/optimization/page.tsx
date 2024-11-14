"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "../../../../../store/DashBoardNavBarState";
import BigChartCard from "@/components/dashboard/Portfolio/optimiser/BigChartCard";
import OptimiserChangeList from "@/components/dashboard/Portfolio/optimiser/OptimiserChangeList";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "next-view-transitions";
import { getOptimisedPortfolio, viewPortfolio } from "@/api/portfolio";
import { usePathname } from "next/navigation";
import { ClassicOrder, CreateOrderItem, OptimisedPortfolio, OptimiserOrders, OrderExecutionProgress, PortfolioData } from "@/lib/types";
import NoPortfolio from "@/components/dashboard/Portfolio/NoPortfolio";
import Loader from "@/components/loader/Loader";
import { createOrdersTransaction } from "@/api/transaction";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import OptimiserOrdersCheckoutCard from "@/components/dashboard/Portfolio/optimiser/OptimiserOrdersCheckoutCard";

export default function Optimization() {
    const router = useTransitionRouter();

    // * Get portfolio id to call api
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    
    const { toast } = useToast();

    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const [indivPortfolioData, setIndividualPortfolio] = useState<PortfolioData | null>(null);
    const [optimizedState, setOptimizedState] = useState<boolean>(false);
    const [optimizedData, setOptimizedData] = useState<OptimisedPortfolio>();
    const [orders, setOrders] = useState<ClassicOrder[]>([]);

    // loaders
    const [loading, setLoading] = useState<boolean>(true);
    const [optimiserLoading, setOptimiserLoading] = useState<boolean>(false);
    const [sendOrdersLoading, setSendOrdersLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const optimisePortfolio = () => {
        getOptimiser(portfolioId);
    }

    const confirmOptimisePortfolio = async () => {
        console.log("Optimise portfolio request sent");
        setSendOrdersLoading(true);
        // Submit to backend to update orders db with newOrders
        const formattedOrders: CreateOrderItem[] = orders.map((order) => ({
            orderType: order.orderType.toUpperCase(),
            assetName: order.assetName,
            quantity: Number(order.quantity),
            price: Number(order.price.toFixed(2)),
            portfolioId: portfolioId,
        }));

        try {
            const result = await createOrdersTransaction(portfolioId, formattedOrders);
            console.log("Orders created successfully: ", result);
            // Navigate back to the dashboard after successful submission
            toast({
                title: `Orders Sent!`,
                description: `Orders have been added to the orderbook successfully, you will now be redirected back to the dashboard`,
            });
            setSendOrdersLoading(false);
            router.push(`/dashboard/${portfolioId}`);
        } catch (error) {
            console.error("Failed to create orders: ", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request: ${error}`,
            });
        }
    }

    useEffect(() => {
        if (portfolioId) {
            getIndividualPortfolio(portfolioId);
        }
    }, [portfolioId]); 
    
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }); 

    const getIndividualPortfolio = async (portfolioId : string) => {
        try {
            const portfolioData = await viewPortfolio(portfolioId);
            setIndividualPortfolio(portfolioData);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            setError('Failed to load portfolio data');
        } finally {
            setLoading(false);
        }
    }

    const getOptimiser = async (portfolioId : string) => {
        setOptimiserLoading(true);
        try {
            const optimisedPortfolioData = await getOptimisedPortfolio(portfolioId);
            setOptimizedData(optimisedPortfolioData);
            setOrders(optimisedPortfolioData.orders);
        } catch (error) {
            console.error('Error fetching optimised portfolio data: ', error);
            setError('Failed to fetch optimised portfolio data');
        } finally {
            setOptimiserLoading(false);
            setOptimizedState(true);
        }
    }

    const handleDelete = (ticker: string) => {
        // Find the order to delete based on the ticker
        const orderToDelete = orders.find(order => order.assetName === ticker);
        
        // If no matching order is found, do nothing
        if (!orderToDelete) return;

        // Update the orders list by filtering out the deleted order
        setOrders((prevOrders) => prevOrders.filter(order => order.assetName !== ticker));

        // Update the proposed holdings in the optimizedData state
        setOptimizedData((prevOptimizedData) => {
            if (!prevOptimizedData) return prevOptimizedData;

            // Check if the stock exists in proposedHoldings
            const stockExistsInHoldings = prevOptimizedData.proposedHoldings.some(holding => holding.assetName === ticker);

            const updatedProposedHoldings = prevOptimizedData.proposedHoldings.map((holding) => {
                if (holding.assetName !== ticker) {
                    return holding;
                }

                // Adjust the quantity based on orderType (BUY subtracts, SELL adds)
                const adjustedQuantity = holding.quantity - (orderToDelete.orderType === "BUY" ? orderToDelete.quantity : -orderToDelete.quantity);

                return {
                    ...holding,
                    quantity: adjustedQuantity,
                };
            });

            // If the stock is not in proposedHoldings, add it with the correct quantity
            if (!stockExistsInHoldings) {
                const newHolding = {
                    orderType: orderToDelete.orderType,
                    orderDate: new Date(),
                    assetName: ticker,
                    quantity: orderToDelete.orderType === "BUY" ? -orderToDelete.quantity : orderToDelete.quantity,
                    price: orderToDelete.price,  // Assuming you want to set the price from the order
                    portfolioId: portfolioId,
                    orderStatus: orderToDelete.orderStatus,
                    company: orderToDelete.company,
                    last: orderToDelete.last,
                };

                updatedProposedHoldings.push(newHolding);
            }

            // Return the updated optimizedData object with the modified proposedHoldings
            return {
                ...prevOptimizedData,
                proposedHoldings: updatedProposedHoldings,
            };
        });
    };

    if (loading) {
        return <Loader />
    };

    if (!indivPortfolioData) return <NoPortfolio />;

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Portfolio Optimiser</h1>
            <BigChartCard data={indivPortfolioData} error={error} optimisedFlag={optimizedState} onOptimisePortfolio={optimisePortfolio} loadingState={optimiserLoading} />
            <OptimiserChangeList data={indivPortfolioData} optimisedData={optimizedData?.proposedHoldings} optimisedFlag={optimizedState} />
            <OptimiserOrdersCheckoutCard data={orders} onDelete={handleDelete}/>
            <div className="flex gap-2 mb-4">
                {sendOrdersLoading ?     
                    <Button className="bg-red-500" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming Orders
                    </Button>
                :
                    <Button
                        type="submit"
                        className={`bg-red-500 ${!optimizedState ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={confirmOptimisePortfolio}
                        disabled={!optimizedState}
                        >
                        Confirm Optimisation
                    </Button>
                }
                <Button type="button" className="bg-gray-400 text-white" onClick={(e) => {
                    e.preventDefault()
                    router.back()
                }}>
                    Cancel
                </Button>
            </div>
        </main>
    )
}