import { Card } from "@/components/ui/card";
import OptimiserChart from "../charts/OptimiserChart";
import { PortfolioData } from "@/lib/types";

interface BigChartCardProps {
    data: PortfolioData;
}

export default function BigChartCard({ data } : BigChartCardProps) {
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <div className="grid grid-cols-2 gap-4">
                <OptimiserChart data={data.portfolioBreakdown.securities} />
            </div>
        </Card>
    )
}