import React, { useEffect, useState } from "react";
import { AddTransactionDataType, Alert, Asset, AssetsItem, PortfolioData } from "@/lib/types";
import PortfolioBreakdownCard from "../PortfolioBreakdownCard";
import AddTransactionCard from "./AddTransactionCard";
import OrdersCheckoutCard from "./OrdersCheckoutCard";
import { Button } from "@/components/ui/button";
import { Link as TransitionLink } from "next-view-transitions";
import Link from 'next/link';
import { fetchAllAssets, fetchAsset, fetchCurrentAssetPrice } from "@/api/asset";
import { getPortfolio } from "@/api/portfolio";
import Loader from "@/components/loader/Loader";
import Error from "@/components/error/Error";
import { v4 as uuidv4 } from 'uuid';
import { date } from "zod";
import { viewIndivLatestNews } from "@/api/financenews";

interface NewOrderFormProps {
    data: PortfolioData;
    prevOrders?: AssetsItem[];
}

export default function NewOrderForm({ data, prevOrders }: NewOrderFormProps) {
    // loaders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [orders, setOrders] = useState<AssetsItem[]>([]);
    const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>(data.triggeredAlerts);
    const [assetsLoading, setAssetsLoading] = useState(true);
    const [allAssets, setAllAssets] = useState<Asset[] | undefined>([]);
    const [assetError, setAssetError] = useState<string | null>(null);
    const [cashBalance, setCashBalance] = useState<number>(0);
    const [buyingPower, setBuyingPower] = useState<number>(0);

    useEffect(() => {
        if (prevOrders) setOrders(prevOrders);
    }, [prevOrders]);

    useEffect(() => {
        getAllAssets();
        getCashBalance();
    }, []);

    const getCashBalance = async () => {
        try {
            const getPortfolioData = await getPortfolio(data.portfolioId);
            setCashBalance(getPortfolioData.cashAmount);
            setBuyingPower(getPortfolioData.cashAmount);
        } catch (error) {
            console.error("Error fetching cash balance: ", error);
            setError("Failed to load portfolios");
        } finally {
            setLoading(false);
        }
    }

    const addTransaction = async (formData: AddTransactionDataType) => {
        // console.log("Received form data in parent:", formData);
        // Call apis to get necessary asset info
        try {
            const assetTicker = formData.ticker;
            const assetInfo = await fetchAsset(assetTicker);
            const assetPrice = await fetchCurrentAssetPrice(assetTicker);

            const newOrderTotalCost = formData.cost * formData.position;
            const existingOrder = orders.find(
                (order) =>
                    order.ticker === formData.ticker &&
                    order.orderType === formData.orderType &&
                    order.cost === formData.cost
            );
            if (existingOrder) {
                const updatedOrder = {
                    ...existingOrder,
                    position: Number(existingOrder.position) + Number(formData.position),
                };
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === existingOrder.id ? updatedOrder : order
                    )
                );

                if (formData.orderType === "Buy") {
                    setBuyingPower((prevBalance) => prevBalance - newOrderTotalCost);
                }
            } else {
                const newOrder: AssetsItem = {
                    ...formData,
                    id: uuidv4(),
                    name: assetInfo.name,
                    geography: assetInfo.geography,
                    market: formData.cost * formData.position,
                    last: assetPrice,
                };
                setOrders([...orders, newOrder]);
                if (formData.orderType === "Buy") {
                    setBuyingPower((prevBalance) => prevBalance - newOrderTotalCost);
                }
            }
            // Add ticker alert to triggeredAlerts array
            const newsAlerts = await viewIndivLatestNews(formData.ticker);
            setTriggeredAlerts((prevAlerts) => [...prevAlerts, newsAlerts[0]]);
        } catch (error) {
            window.alert("An error occurred while adding the transaction. Please try again.");
        }
    }

    const generateOrders = () => {
        // TODO: take orders and push it into backend
    }

    const deleteOrder = (id: string, orderType: string, totalCost: number) => {
        setOrders((prevOrders) => prevOrders.filter(order => order.id !== id));
        if (orderType === "Buy") {
            setBuyingPower((prevBalance) => prevBalance + totalCost);
        }
    }

    const getAllAssets = async () => {
        try {
            const data = await fetchAllAssets();
            setAllAssets(data);
        } catch (error) {
            console.error("Error fetching assets: ", error);
            setAssetError("Failed to load assets");
        } finally {
            setAssetsLoading(false);
        }
    };



    if (loading) {
        return (
            <Loader />
        )
    }

    if (error) return <Error error={error} />

    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <OrdersCheckoutCard data={orders} onDelete={deleteOrder} />
            <AddTransactionCard 
                portfolioId={data.portfolioId} 
                cashBalance={cashBalance} 
                buyingPower={buyingPower} 
                assetsData={allAssets}
                triggeredAlerts={triggeredAlerts}
                addTransaction={addTransaction} 
            />
            <div className="flex gap-4">
                <Link
                    href={{
                        pathname: `/dashboard/${data.portfolioId}/neworder/generateorderlist`,
                        query: { orders: JSON.stringify(orders) },
                    }}
                >
                    <Button className="bg-red-500">Generate Orders List</Button>
                </Link>
                <TransitionLink href={`/dashboard/${data.portfolioId}`}>
                    <Button className="bg-gray-400">Cancel</Button>
                </TransitionLink>
            </div>
        </div>
    )
}