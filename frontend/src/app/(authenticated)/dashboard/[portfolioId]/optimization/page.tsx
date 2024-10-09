"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "../../../../../store/DashBoardNavBarState";
import BigChartCard from "@/components/dashboard/Portfolio/optimiser/BigChartCard";
import OptimiserChangeList from "@/components/dashboard/Portfolio/optimiser/OptimiserChangeList";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "next-view-transitions";
import { getOptimisedPortfolio, viewPortfolio } from "@/api/portfolio";
import { usePathname } from "next/navigation";
import { OptimisedPortfolio, OptimiserOrders, OrderExecutionProgress, PortfolioData } from "@/lib/types";
import NoPortfolio from "@/components/dashboard/Portfolio/NoPortfolio";
import Loader from "@/components/loader/Loader";
import OrderExecutionProgressCard from "@/components/dashboard/Portfolio/OrderExecutionProgressCard";

export default function Optimization() {
    const router = useTransitionRouter();

    // * Get portfolio id to call api
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];

    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const [indivPortfolioData, setIndividualPortfolio] = useState<PortfolioData | null>(null);
    const [optimizedState, setOptimizedState] = useState<boolean>(false);
    const [optimizedData, setOptimizedData] = useState<OptimisedPortfolio>();
    const [orders, setOrders] = useState<OrderExecutionProgress[]>([]);

    // loaders
    const [loading, setLoading] = useState<boolean>(true);
    const [optimiserLoading, setOptimiserLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const optimisePortfolio = () => {
        getOptimiser(portfolioId);
    }

    const confirmOptimisePortfolio = () => {
        // TODO: Add api call to optimiser to post req to optimise portfolio
        console.log("Optimise portfolio request sent");
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
            console.log(order);
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
            <BigChartCard data={indivPortfolioData} alerts={indivPortfolioData.triggeredAlerts} optimisedFlag={optimizedState} onOptimisePortfolio={optimisePortfolio} loadingState={optimiserLoading} />
            <OptimiserChangeList data={indivPortfolioData} optimisedData={optimizedData} optimisedFlag={optimizedState} />
            <OrderExecutionProgressCard data={orders} />
            <div className="flex gap-2 mb-4">
                <Button
                    type="submit"
                    className={`bg-red-500 ${!optimizedState ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={confirmOptimisePortfolio}
                    disabled={!optimizedState}
                    >
                    Confirm Optimisation
                </Button>
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