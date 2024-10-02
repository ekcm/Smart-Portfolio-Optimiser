"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "../../../../../store/DashBoardNavBarState";
import BigChartCard from "@/components/dashboard/Portfolio/optimiser/BigChartCard";
import OptimiserChangeList from "@/components/dashboard/Portfolio/optimiser/OptimiserChangeList";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "next-view-transitions";
import { viewPortfolio } from "@/api/portfolio";
import { usePathname } from "next/navigation";
import { PortfolioData } from "@/lib/types";
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
    const [optimizedData, setOptimizedData] = useState();

    // loaders
    const [loading, setLoading] = useState<boolean>(true);
    const [optimiserLoading, setOptimiserLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const optimisePortfolio = () => {
        // TODO: Add api call to optimiser to get optimised portfolio
        console.log("Optimise portfolio");
        setOptimizedState(true);
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

    // TODO: Add type to optimisedData
    // TODO: Set data to optimisedData
    const getOptimisedPortfolio = async (portfolioId : string) => {
        setOptimiserLoading(true);
        try {
            const optimisedPortfolioData = await getOptimisedPortfolio(portfolioId);
        } catch (error) {
            console.error('Error fetching optimised portfolio data: ', error);
            setError('Failed to fetch optimised portfolio data');
        } finally {
            setOptimiserLoading(false);
        }
    }

    if (loading) {
        return <Loader />
    };

    if (!indivPortfolioData) return <NoPortfolio />;

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Portfolio Optimiser</h1>
            <BigChartCard data={indivPortfolioData} alerts={indivPortfolioData.triggeredAlerts} optimisedFlag={optimizedState} onOptimisePortfolio={optimisePortfolio}  />
            <OptimiserChangeList data={indivPortfolioData} optimisedFlag={optimizedState} />
            <OrderExecutionProgressCard data={[]} />
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