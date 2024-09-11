"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import MainPortfolio from "@/components/dashboard/Portfolio/MainPortfolio";
import { usePathname } from "next/navigation";
import { viewPortfolio, getNames } from "@/api/portfolio";
import { PortfolioData } from "@/lib/types";

export default function Portfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    const [indivPortfolioData, setPortfolio] = useState<PortfolioData | null>(null);
    // loaders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setDashBoardNavBarState("Portfolio");
    }); 

    useEffect(() => {
        const getPortfolio = async () => {
            try {
                const portfolioData = await viewPortfolio(portfolioId);
                const namesData = await getNames(portfolioId);
                const completeData: PortfolioData = {
                    ...portfolioData, 
                    portfolioName: namesData.portfolioName, 
                    clientName: namesData.client,
                };
                setPortfolio(completeData);
                console.log('Complete Data:', completeData);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
                setError('Failed to load portfolio data');
            } finally {
                setLoading(false);
            }
        };

        if (portfolioId) {
            getPortfolio();
        }
    }, [portfolioId]); 

    console.log(indivPortfolioData);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (error) return <div>{error}</div>;
    if (!indivPortfolioData) return <div>No portfolio data available.</div>;

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-semibold">{indivPortfolioData.portfolioName}</h1>
                <h1 className="text-2xl font-medium">Client: {indivPortfolioData.clientName}</h1>
            </div>
            <MainPortfolio data={indivPortfolioData} />
        </main>
    )
}