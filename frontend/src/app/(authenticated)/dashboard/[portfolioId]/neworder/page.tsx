"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../../store/DashBoardNavBarState";

export default function NewOrder() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <div>
            <h1>New Order Form</h1>
        </div>
    )
}