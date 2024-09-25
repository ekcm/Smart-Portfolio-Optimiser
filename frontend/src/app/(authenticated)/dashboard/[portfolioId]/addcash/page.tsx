"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import { usePathname } from "next/navigation";

export default function AddCash() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    // TODO: Pull data from backend for current cash balance

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }); 

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-semibold">Add Cash</h1>
        </main>
    )
}