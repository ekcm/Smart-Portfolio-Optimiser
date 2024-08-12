"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../../store/DashBoardNavBarState";
import BigChartCard from "@/components/dashboard/Portfolio/optimiser/BigChartCard";
import { indivPortfolioData } from "@/lib/mockData";
import OptimiserChangeList from "@/components/dashboard/Portfolio/optimiser/OptimiserChangeList";

export default function Optimization() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);

    // TODO: Add api call to alertsdb for entire portfolio -> call portfolio + orders for data  -> call alertsdb to have triggered alerts based on portfolio + orders data for optimiser
    const mockAlerts = ["Threshold exceeded", "Another mock alert"];

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Portfolio Optimiser</h1>
            <BigChartCard data={indivPortfolioData} alerts={mockAlerts} />
            <OptimiserChangeList data={indivPortfolioData} />
        </main>
    )
}