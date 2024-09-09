"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import MainPortfolio from "@/components/dashboard/Portfolio/MainPortfolio";
import { indivPortfolioData } from "@/lib/mockData";
import { usePathname } from "next/navigation";

export default function Portfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    // CLEMENT
    console.log(portfolioId);

    useEffect(() => {
        setDashBoardNavBarState("Portfolio");
    }); 

    // CLEMENT - use the portfolioId as a param here when calling the api
    const getPortfolio = async() => {
        try {

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-semibold">{indivPortfolioData.portfolioName}</h1>
                <h1 className="text-3xl font-medium">{indivPortfolioData.clientName}</h1>
            </div>
            <MainPortfolio data={indivPortfolioData} />
        </main>
    )
}