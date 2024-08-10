"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../../../store/DashBoardNavBarState";
import { indivPortfolioData } from "@/lib/mockData";
import NewOrderForm from "@/components/dashboard/Portfolio/orderform/NewOrderForm";
import { usePathname, useSearchParams } from "next/navigation";
import { AssetsItem } from "@/lib/types";

export default function NewOrder() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    // * Get portfolio id to call api
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    const searchParams = useSearchParams();
    const ordersParam = searchParams.get('orders');

    // ! Data will be called from backend, ideally from cache since already called previously
    let orders: AssetsItem[] = [];
    if (ordersParam) {
        orders = JSON.parse(ordersParam);
    }

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }, []); 

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Create New Order</h1>
            {ordersParam ? 
                <NewOrderForm data={indivPortfolioData} prevOrders={orders} />
            :
                <NewOrderForm data={indivPortfolioData} />
            }
        </main>
    )
}