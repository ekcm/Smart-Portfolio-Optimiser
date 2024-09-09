"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import CreatePortfolioForm from "@/components/dashboard/create-client-portfolio/CreatePortfolioForm";

export default function CreateClientPortfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }); 

    return (
        <main 
            className="flex flex-col justify-between pt-6 px-24 gap-6"
        >
            <h1 className="text-3xl font-semibold">Create Client Portfolio</h1>
            <CreatePortfolioForm />
        </main>
    )
}