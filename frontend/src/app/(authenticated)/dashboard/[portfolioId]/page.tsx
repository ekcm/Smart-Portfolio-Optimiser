"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../store/DashBoardNavBarState";
import MainPortfolio from "@/components/dashboard/Portfolio/MainPortfolio";
import { indivPortfolioData } from "@/lib/mockData";

export default function Portfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Portfolio");
    }); 

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Portfolio Name 1</h1>
            <MainPortfolio data={indivPortfolioData} />
        </main>
    )
}