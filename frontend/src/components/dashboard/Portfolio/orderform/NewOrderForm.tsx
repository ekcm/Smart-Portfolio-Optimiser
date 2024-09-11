import React, { useEffect, useState } from "react";
import { AddTransactionDataType, Asset, AssetsItem, PortfolioData } from "@/lib/types";
import PortfolioBreakdownCard from "../PortfolioBreakdownCard";
import AddTransactionCard from "./AddTransactionCard";
import OrdersCheckoutCard from "./OrdersCheckoutCard";
import { Button } from "@/components/ui/button";
import { Link as TransitionLink } from "next-view-transitions";
import Link from 'next/link';
import { fetchAllAssets, fetchAsset, fetchCurrentAssetPrice } from "@/api/asset";

interface NewOrderFormProps {
    data: PortfolioData;
    prevOrders?: AssetsItem[];
}

const initialMockOrders: AssetsItem[] = [
        {
            name: "Apple",
            ticker: "AAPL",
            type: "Stock",
            geography: "USA",
            position: 10,
            market: 8779.00,
            last: 178.58,
            cost: 130.23,
            orderType: "Buy",
        },
        {
            name: "NVIDIA",
            ticker: "NVDA",
            type: "Stock",
            geography: "USA",
            position: 10,
            market: 3245.00,
            last: 124.74,
            cost: 120.42,
            orderType: "Sell",
        },
        {
            name: "Meta Platforms",
            ticker: "META",
            type: "Stock",
            geography: "USA",
            position: 10,
            market: 8779.00,
            last: 178.58,
            cost: 130.23,
            orderType: "Buy",
        }
    ]

export default function NewOrderForm({ data, prevOrders }: NewOrderFormProps) {
    const [orders, setOrders] = useState<AssetsItem[]>([]);
    const [assetsLoading, setAssetsLoading] = useState(true);
    const [allAssets, setAllAssets] = useState<Asset[] | undefined>([]);
    const [assetError, setAssetError] = useState<string | null>(null);


    useEffect(() => {
        if (prevOrders) setOrders(prevOrders);
    }, [prevOrders]);

    useEffect(() => {
        getAllAssets();
    }, []);

    const addTransaction = async (formData: AddTransactionDataType) => {
        console.log("Received form data in parent:", formData);
        // Call apis to get necessary asset info
        const assetTicker = formData.ticker;
        const assetInfo = await fetchAsset(assetTicker);
        const assetPrice = await fetchCurrentAssetPrice(assetTicker);
        const newOrder: AssetsItem = {
            ...formData,
            name: assetInfo.name,
            geography: assetInfo.geography,
            market: formData.cost * formData.position,
            last: assetPrice, 
        };
        setOrders([...orders, newOrder]);
    }

    const generateOrders = () => {
        // TODO: take orders and push it into backend
    }

    const deleteOrder = (ticker: string) => {
        setOrders((prevOrders) => prevOrders.filter(order => order.ticker !== ticker));
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


    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <OrdersCheckoutCard data={orders} onDelete={deleteOrder}/>
            <AddTransactionCard portfolioId={data.portfolioId} assetsData={allAssets} addTransaction={addTransaction}/>
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