import CustomBadge from "@/components/global/CustomBadge";
import { Card } from "@/components/ui/card"
import { PortfolioAnalysis } from "@/lib/types"

interface PortfolioAnalysisCardProps {
    data: PortfolioAnalysis
}

export default function PortfolioAnalysisCard({ data } : PortfolioAnalysisCardProps) {
    const computeDailyPL = () => {
        const formattedPL = Math.abs(data.dailyPL).toFixed(2);
        if (data.dailyPL < 0) {
            return "-$" + formattedPL;
        } else {
            return "$" + formattedPL;
        }
    }
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Portfolio Analysis</h2>
            <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col">
                    <span className="text-md text-gray-500">Total Assets:</span>
                    <span className="text-lg font-medium">${data.totalAssets}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-md text-gray-500">Daily P&L:</span>
                    <span className="text-md font-medium">{computeDailyPL()}</span>
                    <CustomBadge amount={data.dailyPLPercentage}/>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-md text-gray-500">Total P&L:</span>
                    <span className="text-md font-medium">${data.totalPL.toFixed(2)}</span>
                    <CustomBadge amount={data.totalPLPercentage}/>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-md text-gray-500">Annualized RoR:</span>
                    <span className="text-md font-medium">{data.annualizedRoR.toFixed(2)}%</span>
                </div>
            </div>
        </Card>
    )
}