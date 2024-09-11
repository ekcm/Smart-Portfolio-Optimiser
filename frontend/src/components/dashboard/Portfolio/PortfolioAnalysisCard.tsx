import CustomBadge from "@/components/global/CustomBadge";
import { Card } from "@/components/ui/card"
import { PortfolioAnalysis } from "@/lib/types"

interface PortfolioAnalysisCardProps {
    data: PortfolioAnalysis
}

export default function PortfolioAnalysisCard({ data } : PortfolioAnalysisCardProps) {
    const computePL = (PL: number) => {
        const formattedPL = Math.abs(PL).toFixed(2);
        if (PL < 0) {
            return "-$" + formattedPL;
        } else {
            return "+$" + formattedPL;
        }
    }
    const getCellClass = (value: number) => value > 0 ? 'text-green-700' : value < 0 ? 'text-red-400' : '';

    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Portfolio Analysis</h2>
            <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col">
                    <span className="text-md text-gray-500">Total Assets:</span>
                    <span className="text-lg font-medium">${data.totalAssets.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-md text-gray-500">Daily P&L:</span>
                    <span className="text-md font-medium">{computePL(data.dailyPL)}</span>
                    <CustomBadge amount={data.dailyPLPercentage}/>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-md text-gray-500">Total P&L:</span>
                    <span className="text-md font-medium">{computePL(data.totalPL)}</span>
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