import { OrderStockItem, PortfolioData } from "@/lib/types";
import PortfolioBreakdownCard from "../../PortfolioBreakdownCard";
import ChangeList from "./ChangeList";

interface OrderListProps {
    data: PortfolioData;
    newOrders: OrderStockItem[];
}

export default function OrderList({ data, newOrders } : OrderListProps) {
    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <h1 className="text-3xl font-semibold">Changes</h1>
            <ChangeList oldOrders={data.portfolioHoldings} newOrders={newOrders} />
        </div>
    )
}