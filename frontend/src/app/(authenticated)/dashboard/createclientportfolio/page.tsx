"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import CreatePortfolioForm from "@/components/dashboard/create-client-portfolio/CreatePortfolioForm";
import { ClassicOrder, CreateOrderItem } from "@/lib/types";
import ProposalOrdersCheckoutCard from "@/components/dashboard/Portfolio/orderform/ProposalOrdersCheckoutCard";
import { createOrdersTransaction } from "@/api/transaction";
import { useToast } from "@/hooks/use-toast";
import { useTransitionRouter } from "next-view-transitions";

export default function CreateClientPortfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const router = useTransitionRouter();
    const { toast } = useToast();
    
    // Page state
    const [createPortfolioState, setCreatePortfolioState] = useState<boolean>(false);
    const [portfolioId, setPortfolioId] = useState<string>("");
    const [orders, setOrders] = useState<ClassicOrder[]>([]);
    const [sendOrdersLoading, setSendOrdersLoading] = useState<boolean>(false);

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }); 

    // format orders and send orders out to orderbook
    const handleOrders = async () => {
        console.log("Orders request sent");
        setSendOrdersLoading(true);
        // Submit to backend to update orders db with newOrders
        const formattedOrders: CreateOrderItem[] = orders.map((order) => ({
            orderType: order.orderType.toUpperCase(),
            assetName: order.assetName,
            quantity: Number(order.quantity),
            price: Number(order.price.toFixed(2)),
            portfolioId: portfolioId,
        }));

        try {
            const result = await createOrdersTransaction(portfolioId, formattedOrders);
            console.log("Orders created successfully: ", result);
            // Navigate back to the dashboard after successful submission
            toast({
                title: `Orders Sent!`,
                description: `Orders have been added to the orderbook successfully, you will now be redirected back to the portfolio dashboard`,
            });
            setSendOrdersLoading(false);
            router.push(`/dashboard/${portfolioId}`);
        } catch (error) {
            console.error("Failed to create orders: ", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request: ${error}`,
            });
        }
    }

    const handleDelete = (ticker: string) => {
        setOrders((prevOrders) => prevOrders.filter(order => order.assetName !== ticker));
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
                    {createPortfolioState && 
                        <ProposalOrdersCheckoutCard 
                            data={orders}
                            ordersLoading={sendOrdersLoading}
                            onConfirmOrder={handleOrders}
                            onDelete={handleDelete} 
                        />
                    }
                </div>
            </div>
        </main>
    )
}