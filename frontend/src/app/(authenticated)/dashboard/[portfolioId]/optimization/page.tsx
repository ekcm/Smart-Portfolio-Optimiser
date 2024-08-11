"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../../store/DashBoardNavBarState";
import BigChartCard from "@/components/dashboard/Portfolio/optimiser/BigChartCard";
import { indivPortfolioData } from "@/lib/mockData";

export default function Optimization() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Portfolio Optimiser</h1>
            <BigChartCard data={indivPortfolioData} />
        </main>
    )
}