import { PortfolioData } from "@/lib/mockData";
import IndivPortfolioCard from "./IndivPortfolioCard";
import { useDashboardFilterStore } from "../../../store/DashBoardFilterState";
import { useEffect, useState } from "react";
import { PortfolioItem } from "@/lib/types";

export default function Portfolios() {
    // all states from filter
    const portfolioName = useDashboardFilterStore((state) => state.portfolioName);
    const riskAppetite = useDashboardFilterStore((state) => state.riskAppetite);
    const triggeredAlerts = useDashboardFilterStore((state) => state.triggeredAlerts);

    const [filteredPortfolios, setFilteredPortfolios] = useState<PortfolioItem[]>(PortfolioData);

    useEffect(() => {
        // Filter the portfolio data based on the filter variables
        const filtered = PortfolioData.filter((portfolio) => {
            const matchesName = portfolioName
                ? portfolio.portfolioName.toLowerCase().includes(portfolioName.toLowerCase())
                : true;
            const matchesRiskAppetite = riskAppetite && riskAppetite !== "No Filter"
                ? portfolio.riskAppetite === riskAppetite
                : true;
            const matchesAlerts = triggeredAlerts
                ? portfolio.alert.length > 0
                : true;

            return matchesName && matchesRiskAppetite && matchesAlerts;
        });

        setFilteredPortfolios(filtered);
    }, [portfolioName, riskAppetite, triggeredAlerts]);

    return (
        <div className="flex flex-col items-center gap-6">
            {filteredPortfolios.map((portfolio, index) => (
                <IndivPortfolioCard key={portfolio.portfolioId} data={portfolio}/>
            ))}
        </div>
    )
}