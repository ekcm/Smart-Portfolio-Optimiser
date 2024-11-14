import { Card } from "@/components/ui/card";
import OptimiserChart from "../charts/OptimiserChart";
import { PortfolioData } from "@/lib/types";
import OptimiserAlert from "./OptimiserAlert";

interface BigChartCardProps {
    data: PortfolioData;
    error: string | null;
    optimisedFlag: boolean;
    loadingState: boolean;
    onOptimisePortfolio: () => void;
}

export default function BigChartCard({ data, error, optimisedFlag, loadingState, onOptimisePortfolio } : BigChartCardProps) {
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <OptimiserChart data={data.portfolioBreakdown.securities} />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <OptimiserAlert data={data.triggeredAlerts} ruleReport={data.breachedRules} error={error} optimized={optimisedFlag} onOptimise={onOptimisePortfolio} loadingState={loadingState} />
                </div>
            </div>
        </Card>
    )
}