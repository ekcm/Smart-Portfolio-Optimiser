import React from "react";
import { AddTransactionDataType, OrderStockItem, PortfolioData } from "@/lib/types";
import PortfolioBreakdownCard from "../PortfolioBreakdownCard";
import AddTransactionCard from "./AddTransactionCard";
import OrdersCheckoutCard from "./OrdersCheckoutCard";
import { Button } from "@/components/ui/button";
import { Link as TransitionLink } from "next-view-transitions";
import Link from 'next/link';

interface NewOrderFormProps {
    data: PortfolioData;
}

const mockOrders: OrderStockItem[] = [
        {
            name: "Apple",
            ticker: "AAPL",
            type: "Stock",
            geography: "USA",
            position: 50,
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
            position: 50,
            market: 8779.00,
            last: 178.58,
            cost: 130.23,
            orderType: "Sell",
        },
        {
            name: "Meta Platforms",
            ticker: "META",
            type: "Stock",
            geography: "USA",
            position: 50,
            market: 8779.00,
            last: 178.58,
            cost: 130.23,
            orderType: "Buy",
        }
    ]

export default function NewOrderForm({ data }: NewOrderFormProps) {

    const addTransaction = (formData: AddTransactionDataType) => {
        console.log("Received form data in parent:", formData);
    }

    const generateOrders = () => {
        // take orders and push it into backend
    }

    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <OrdersCheckoutCard data={mockOrders}/>
            <AddTransactionCard portfolioId={data.portfolioId} addTransaction={addTransaction}/>
            <div className="flex gap-4">
                <Link 
                    href={{
                        pathname: `/dashboard/${data.portfolioId}/neworder/generateorderlist`,
                        query: { orders: JSON.stringify(mockOrders) },
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