"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import CreatePortfolioForm from "@/components/dashboard/create-client-portfolio/CreatePortfolioForm";
import { OptimiserOrders } from "@/lib/types";
import ProposalOrdersCheckoutCard from "@/components/dashboard/Portfolio/orderform/ProposalOrdersCheckoutCard";

export default function CreateClientPortfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    
    // Page state
    const [createPortfolioState, setCreatePortfolioState] = useState<boolean>(false);
    const [portfolioId, setPortfolioId] = useState<string>("");
    const [orders, setOrders] = useState<OptimiserOrders[]>([]);

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }); 



    const handleDelete = () => {

    }

    return (
        <main 
            className="flex flex-col justify-between pt-6 px-24 gap-6"
        >
            <h1 className="text-3xl font-semibold">Create Client Portfolio</h1>
            <div className="flex flex-row w-full gap-6">
                <div className="w-1/2">
                    <CreatePortfolioForm 
                        createPortfolioState={createPortfolioState} 
                        setCreatePortfolioState={setCreatePortfolioState} 
                        setOrders={setOrders} 
                        setPortfolioId={setPortfolioId} 
                    />
                </div>
                <div className="w-1/2">
                    {createPortfolioState && <ProposalOrdersCheckoutCard data={orders} onDelete={handleDelete} /> }
                </div>
            </div>
        </main>
    )
}