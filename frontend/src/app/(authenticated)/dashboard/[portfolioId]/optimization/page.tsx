"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "../../../../../store/DashBoardNavBarState";
import BigChartCard from "@/components/dashboard/Portfolio/optimiser/BigChartCard";
import OptimiserChangeList from "@/components/dashboard/Portfolio/optimiser/OptimiserChangeList";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "next-view-transitions";
import { getOptimisedPortfolio, viewPortfolio } from "@/api/portfolio";
import { usePathname } from "next/navigation";
import { CreateOrderItem, OptimisedPortfolio, OptimiserOrders, OrderExecutionProgress, PortfolioData } from "@/lib/types";
import NoPortfolio from "@/components/dashboard/Portfolio/NoPortfolio";
import Loader from "@/components/loader/Loader";
import OrderExecutionProgressCard from "@/components/dashboard/Portfolio/OrderExecutionProgressCard";
import { createOrdersTransaction } from "@/api/transaction";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
    const [orders, setOrders] = useState<OrderExecutionProgress[]>([]);

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
            assetName: order.ticker,
            quantity: Number(order.position),
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
            console.log(optimisedPortfolioData);
            setOptimizedData(optimisedPortfolioData);
            // TODO: Set orders here with classicorders
            createOrderExecutionProgress(optimisedPortfolioData.orders)
        } catch (error) {
            console.error('Error fetching optimised portfolio data: ', error);
            setError('Failed to fetch optimised portfolio data');
        } finally {
            setOptimiserLoading(false);
            setOptimizedState(true);
        }
    }

    const createOrderExecutionProgress = (ordersData: OptimiserOrders[]) => {
        const newOrders: OrderExecutionProgress[] = ordersData.map(order => {
            // Find the corresponding holding in indivPortfolioData
            const currentHolding = indivPortfolioData?.portfolioHoldings.find(holding => holding.ticker === order.assetName);
            return {
                name: currentHolding ? currentHolding.name : order.assetName, // Fallback to assetName if not found
                ticker: order.assetName,
                position: Number(order.quantity.toFixed(0)), // Use quantity from current holding
                last: currentHolding ? currentHolding.last : 0, // You can modify this if you need a different calculation
                price: order.price,
                orderType: order.orderType,
                orderStatus: order.orderStatus,
                orderDate: order.orderDate,
            };
        });
        setOrders(newOrders);
    };

    if (loading) {
        return <Loader />
    };

    if (!indivPortfolioData) return <NoPortfolio />;

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Portfolio Optimiser</h1>
            <BigChartCard data={indivPortfolioData} alerts={indivPortfolioData.triggeredAlerts} error={error} optimisedFlag={optimizedState} onOptimisePortfolio={optimisePortfolio} loadingState={optimiserLoading} />
            <OptimiserChangeList data={indivPortfolioData} optimisedData={optimizedData} optimisedFlag={optimizedState} />
            {/* TODO: Change to ordersCheckoutCard */}
            
            <OrderExecutionProgressCard data={orders} />
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