import { OptimisedPortfolio, PortfolioData, PortfolioHoldingDifference } from "@/lib/types";
import OldOrdersCard from "../orderform/orderlist/OldOrdersCard";
import SecuritiesChart from "../charts/SecuritiesChart";
import { Card } from "@/components/ui/card";
import OptimisedOrdersCard from "./OptimisedOrdersCard";
import OptimisedSecuritiesChart from "../charts/OptimisedSecuritiesChart";

interface OptimiserChangeListProps {
    data: PortfolioData;
    optimisedData?: OptimisedPortfolio;
    optimisedFlag: boolean;
}

export default function OptimiserChangeList({ data, optimisedData, optimisedFlag } : OptimiserChangeListProps) {
    // create difference array here then pass to optimiseorderscard

    const holdingDifferences: PortfolioHoldingDifference[] = [];

    // Iterate over the proposed holdings to calculate differences
    optimisedData?.proposedHoldings.forEach(proposedHolding => {
        // Find the corresponding current holding by ticker
        const currentHolding = data.portfolioHoldings.find(holding => holding.ticker === proposedHolding.assetName);
        
        // Calculate the difference
        const currentQuantity = currentHolding ? currentHolding.position : 0; // Default to 0 if not found
        const difference = proposedHolding.quantity - currentQuantity; // Calculate the difference

        // Push the result into the holdingDifferences array
        if (proposedHolding.quantity > 1) {
            holdingDifferences.push({
                ticker: proposedHolding.assetName,
                name: currentHolding ? currentHolding.name : "",
                last: currentHolding ? currentHolding.last : 0,
                position: Number(proposedHolding.quantity.toFixed(0)),
                difference: Number(difference.toFixed(0)),
                market: currentHolding ? currentHolding.market : 0,
                cost: currentHolding ? currentHolding.cost : 0,
            });
        }
    });

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
                    <OptimisedOrdersCard data={holdingDifferences} optimisedFlag={optimisedFlag} />
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