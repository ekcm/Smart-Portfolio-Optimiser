"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import { indivPortfolioData } from "@/lib/mockData";
import OrderList from '@/components/dashboard/Portfolio/orderform/orderlist/OrderList';

export default function GenerateOrderList() {
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    const searchParams = useSearchParams();
    const ordersParam = searchParams.get('orders');

    // ! Data will be called from backend, ideally from cache since already called previously
    
    let orders = [];
    if (ordersParam) {
        orders = JSON.parse(ordersParam);
    }

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <h1 className="text-3xl font-bold">Create New Order</h1>
            <OrderList data={indivPortfolioData} newOrders={orders} />
        </main>
    )
}