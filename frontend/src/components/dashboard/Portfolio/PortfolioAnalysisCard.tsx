import CustomBadge from "@/components/global/CustomBadge";
import { Card } from "@/components/ui/card";
import { PortfolioAnalysis } from "@/lib/types";

interface PortfolioAnalysisCardProps {
  data: PortfolioAnalysis;
}

export default function PortfolioAnalysisCard({
  data,
}: PortfolioAnalysisCardProps) {
  const computePL = (PL: number) => {
    const formattedPL = Math.abs(PL).toFixed(2);
    if (PL < 0) {
      return "-$" + formattedPL;
    } else {
      return "+$" + formattedPL;
    }
  };
  const getCellClass = (value: number) =>
    value > 0 ? "text-green-700" : value < 0 ? "text-red-400" : "";

  return (
    <Card className="flex flex-col w-full gap-4 mt-4 border-none shadow-none">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <hr className="col-span-2 border-t border-gray-300 w-5/6" />
          <span className="text-md text-gray-500 mt-2">Total Assets:</span>
          <span className="text-lg font-medium">
            ${data.totalAssets.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 mt-2">Securities Value:</span>
          <span className="text-sm font-medium">
            ${data.securitiesValue.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 mt-2">Available Cash:</span>
          <span className="text-sm font-medium">
            ${data.cashAmount.toFixed(2)} (
            {((data.cashAmount / data.totalAssets) * 100).toFixed(2)}%)
          </span>
        </div>
        <div className="flex flex-col">
          <hr className="border-t border-gray-300 w-5/6" />
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-md text-gray-500">Daily P&L:</span>
            <div className="flex items-center gap-2">
              <span className="text-md font-medium">
                {computePL(data.dailyPL)}
              </span>
              <CustomBadge amount={data.dailyPLPercentage} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-md text-gray-500">Total P&L:</span>
            <div className="flex items-center gap-2">
              <span className="text-md font-medium">
                {computePL(data.totalPL)}
              </span>
              <CustomBadge amount={data.totalPLPercentage} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
