import { Card } from "@/components/ui/card";
import { PortfolioBreakdown } from "@/lib/types";
import IndustryChart from "./charts/IndustryChart";
import SecuritiesChart from "./charts/SecuritiesChart";
import GeographyChart from "./charts/GeographyChart";

interface PortfolioBreakdownCardProps {
    data: PortfolioBreakdown
}

export default function PortfolioBreakdownCard({ data } : PortfolioBreakdownCardProps) {
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Portfolio BreakDown</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-md text-gray-500">Industry Sector</span>
                    {/* <div className="flex items-center justify-between pr-8">
                        <span className="text-xs">Industry Sector</span>
                        <span className="text-xs">Sector Ratio</span>
                    </div> */}
                    <IndustryChart data={data.industry} />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-md text-gray-500">Geography Sector</span>
                    {/* <div className="flex items-center justify-between pr-8">
                        <span className="text-xs">Geography Sector</span>
                        <span className="text-xs">Sector Ratio</span>
                    </div> */}
                    <GeographyChart data={data.geography} />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-md text-gray-500">Securities Type</span>
                    {/* <div className="flex items-center justify-between pr-8">
                        <span className="text-xs">Securities Type</span>
                        <span className="text-xs">Sector Ratio</span>
                    </div> */}
                    <SecuritiesChart data={data.securities} />
                </div>
            </div>
        </Card>
    )
}