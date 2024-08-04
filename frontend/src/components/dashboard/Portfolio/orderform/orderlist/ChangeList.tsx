import { OrderStockItem, PortfolioHoldings } from "@/lib/types";

interface ChangeListProps {
    oldOrders: PortfolioHoldings[];
    newOrders: OrderStockItem[];
}

// TODO: Calculate difference then show difference
export default function ChangeList({ oldOrders, newOrders } : ChangeListProps) {
    return (
        <>

        </>
    )
}