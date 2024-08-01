import React from "react";
import { PortfolioData } from "@/lib/types";
import TriggeredAlert from "./TriggeredAlert";
import PortfolioAnalysisCard from "./PortfolioAnalysisCard";
import PortfolioBreakdownCard from "./PortfolioBreakdownCard";
import PortfolioHoldingsCard from "./PortfolioHoldingsCard";
import OrderExecutionProgressCard from "./OrderExecutionProgressCard";

interface MainPortfolioProps {
  data: PortfolioData;
}

export default function MainPortfolio({ data }: MainPortfolioProps) {
    return (
        <div className="flex flex-col justify-center gap-4 pb-8">
            <TriggeredAlert data={data.triggeredAlerts} />
            <PortfolioAnalysisCard data={data.portfolioAnalysis} />
            <PortfolioBreakdownCard data={data.portfolioBreakdown} />
            <PortfolioHoldingsCard data={data.portfolioHoldings} />
            <OrderExecutionProgressCard data={data.orderExecutionProgress} />
        </div>
    )
}