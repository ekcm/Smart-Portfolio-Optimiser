"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../../store/DashBoardNavBarState";

export default function Optimization() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <div>
            <h1>Optimization</h1>
        </div>
    )
}