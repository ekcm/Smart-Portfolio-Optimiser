"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../store/DashBoardNavBarState";

export default function CreateClientPortfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <>
            Create Client Portfolio page
        </>
    )
}