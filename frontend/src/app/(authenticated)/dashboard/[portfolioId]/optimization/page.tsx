"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "../../../../../../store/DashBoardNavBarState";
import BigChartCard from "@/components/dashboard/Portfolio/optimiser/BigChartCard";
import { indivPortfolioData } from "@/lib/mockData";
import OptimiserChangeList from "@/components/dashboard/Portfolio/optimiser/OptimiserChangeList";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "next-view-transitions";

export default function Optimization() {
    const router = useTransitionRouter();

    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const [optimizedState, setOptimizedState] = useState<boolean>(false);

    // TODO: Add api call to alertsdb for entire portfolio -> call portfolio + orders for data  -> call alertsdb to have triggered alerts based on portfolio + orders data for optimiser
    const mockAlerts = ["Threshold exceeded", "Another mock alert"];

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
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Portfolio Optimiser</h1>
            <BigChartCard data={indivPortfolioData} alerts={mockAlerts} optimisedFlag={optimizedState} onOptimisePortfolio={optimisePortfolio}  />
            <OptimiserChangeList data={indivPortfolioData} optimisedFlag={optimizedState} />
            <div className="flex gap-2 mb-4">
                {/* <Button type="submit" className="bg-red-500" onClick={confirmOptimisePortfolio}>Confirm Optimisation</Button> */}
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