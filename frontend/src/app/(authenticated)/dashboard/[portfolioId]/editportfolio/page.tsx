"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../../store/DashBoardNavBarState";

export default function EditClientPortfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <div>
            <h1>Edit Client Portfolio Form</h1>
        </div>
    )
}