import { PortfolioData } from "@/lib/types";
import OldOrdersCard from "../orderform/orderlist/OldOrdersCard";

interface OptimiserChangeListProps {
    data: PortfolioData;
}

export default function OptimiserChangeList({ data } : OptimiserChangeListProps) {
    return (
        <div>
            <h1 className="text-3xl font-medium">Changes</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Current Portfolio Holdings</h2>
                    <OldOrdersCard data={data.portfolioHoldings} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Proposed Portfolio Holdings</h2>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Current Portfolio Breakdown</h2>

                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Proposed Portfolio Breakdown</h2>

                </div>
            </div>
        </div>
    )
}