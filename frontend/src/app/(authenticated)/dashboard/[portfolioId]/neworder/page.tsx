"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import NewOrderForm from "@/components/dashboard/Portfolio/orderform/NewOrderForm";
import { usePathname, useSearchParams } from "next/navigation";
import { AssetsItem, PortfolioData } from "@/lib/types";
import { viewPortfolio } from "@/api/portfolio";
import Loader from "@/components/loader/Loader";
import NoPortfolio from "@/components/dashboard/Portfolio/NoPortfolio";
import Error from "@/components/error/Error";

export default function NewOrder() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    // * Get portfolio id to call api
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    const searchParams = useSearchParams();
    const ordersParam = searchParams.get('orders');
    const [indivPortfolioData, setIndividualPortfolio] = useState<PortfolioData | null>(null);
    // loaders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ! Data will be called from backend, ideally from cache since already called previously
    let orders: AssetsItem[] = [];
    if (ordersParam) {
        orders = JSON.parse(ordersParam);
    }

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    }); 

    useEffect(() => {
        if (portfolioId) {
            getIndividualPortfolio(portfolioId);
        }
    }, [portfolioId]); 

    const getIndividualPortfolio = async (portfolioId: string) => {
        try {
            const portfolioData = await viewPortfolio(portfolioId);
            setIndividualPortfolio(portfolioData);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            setError('Failed to load portfolio data');
        } finally {
            setLoading(false);
        }
    };

    // loading state
    if (loading) {
        return (
            <Loader />
        );
    }

    if (error) return <Error error={error} />;
    if (!indivPortfolioData) return <NoPortfolio />;

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