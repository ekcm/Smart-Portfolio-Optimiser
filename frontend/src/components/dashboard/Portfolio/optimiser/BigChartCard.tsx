import { Card } from "@/components/ui/card";
import OptimiserChart from "../charts/OptimiserChart";
import { PortfolioData } from "@/lib/types";
import OptimiserAlert from "./OptimiserAlert";

interface BigChartCardProps {
    data: PortfolioData;
    alerts: string[];
}

export default function BigChartCard({ data, alerts} : BigChartCardProps) {
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-3">
                    <OptimiserChart data={data.portfolioBreakdown.securities} />
                </div>
                <div className="col-span-3 flex items-center justify-center">
                    <OptimiserAlert data={alerts} optimized={false} />
                </div>
            </div>
        </Card>
    )
}