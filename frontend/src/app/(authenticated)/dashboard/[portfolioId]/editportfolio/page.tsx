"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import EditPortfolioForm from "@/components/dashboard/Portfolio/EditPortfolioForm";
import { usePathname } from "next/navigation";

export default function EditClientPortfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }); 

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-semibold">Edit Client Portfolio</h1>
            <EditPortfolioForm portfolioId={portfolioId} />
        </main>
    )
}