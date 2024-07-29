"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../store/DashBoardNavBarState";
import CreatePortfolioForm from "@/components/dashboard/create-client-portfolio/CreatePortfolioForm";

export default function CreateClientPortfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <div>
            <CreatePortfolioForm />
        </div>
    )
}