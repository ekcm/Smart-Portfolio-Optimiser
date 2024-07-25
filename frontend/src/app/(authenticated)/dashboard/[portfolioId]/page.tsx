"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../store/DashBoardNavBarState";

export default function Portfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Portfolio");
    }, []); 

    return (
        <>
            Individual Portfolio page
        </>
    )
}