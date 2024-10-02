import { PortfolioData } from "@/lib/types";
import OldOrdersCard from "../orderform/orderlist/OldOrdersCard";
import SecuritiesChart from "../charts/SecuritiesChart";
import { Card } from "@/components/ui/card";
import OptimisedOrdersCard from "./OptimisedOrdersCard";
import { mockOptimizer } from "@/lib/mockData";
import OptimisedSecuritiesChart from "../charts/OptimisedSecuritiesChart";

interface OptimiserChangeListProps {
    data: PortfolioData;
    // ! Need to change this after backend optimiser is built
    optimisedData?: PortfolioData;
    optimisedFlag: boolean;
}

export default function OptimiserChangeList({ data, optimisedData, optimisedFlag } : OptimiserChangeListProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-medium">Changes</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Current Portfolio Holdings</h2>
                    <OldOrdersCard data={data.portfolioHoldings} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Proposed Portfolio Holdings</h2>
                    <OptimisedOrdersCard data={mockOptimizer.portfolioHoldings} optimisedFlag={optimisedFlag} />
                </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Current Portfolio Breakdown</h2>
                    <Card className="flex flex-col w-full p-4 gap-2 h-80 overflow-y-auto">
                        <SecuritiesChart data={data.portfolioBreakdown.securities} />
                    </Card>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Proposed Portfolio Breakdown</h2>
                    <Card className="flex flex-col w-full p-4 gap-2 h-80 overflow-y-auto">
                       <OptimisedSecuritiesChart data={mockOptimizer.portfolioBreakdown} optimisedFlag={optimisedFlag} />
                    </Card>
                </div>
            </div> */}
        </div>
    )
}