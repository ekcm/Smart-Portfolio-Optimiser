import React, { useEffect, useState } from "react";
import { AddTransactionDataType, AssetsItem, PortfolioData } from "@/lib/types";
import PortfolioBreakdownCard from "../PortfolioBreakdownCard";
import AddTransactionCard from "./AddTransactionCard";
import OrdersCheckoutCard from "./OrdersCheckoutCard";
import { Button } from "@/components/ui/button";
import { Link as TransitionLink } from "next-view-transitions";
import Link from 'next/link';

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
    const [orders, setOrders] = useState<AssetsItem[]>(initialMockOrders);
    useEffect(() => {
        if (prevOrders) setOrders(prevOrders);
    }, [prevOrders]);

    // TODO: Remove in future after backend implemented
    const [fakeTickerCount, setFakeTickerCount] = useState<number>(0);
    const fakeTickers = ["APPL", "FAKE", "BTCN"];

    const addTransaction = (formData: AddTransactionDataType) => {
        console.log("Received form data in parent:", formData);
        // ! Need to call api for this to get necessary asset info
        const newOrder: AssetsItem = {
            ...formData,
            ticker: fakeTickers[fakeTickerCount], // ! asset ticker need to be called from backend
            geography: "USA", // ! geography need to be called from backend
            market: formData.cost * formData.position,
            last: 178.58, // ! Cost of asset need to be called from backend
        };
        setOrders([...orders, newOrder]);
        setFakeTickerCount(prevCount => prevCount+1);
    }

    const generateOrders = () => {
        // take orders and push it into backend
    }

    const deleteOrder = (ticker: string) => {
        setOrders((prevOrders) => prevOrders.filter(order => order.ticker !== ticker));
    }


    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <OrdersCheckoutCard data={orders} onDelete={deleteOrder}/>
            <AddTransactionCard portfolioId={data.portfolioId} addTransaction={addTransaction}/>
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