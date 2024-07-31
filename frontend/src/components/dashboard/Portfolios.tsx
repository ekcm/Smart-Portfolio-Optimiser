import { PortfolioData } from "@/lib/mockData";
import IndivPortfolioCard from "./IndivPortfolioCard";
import { useFilterStore } from "../../../store/FilterState";
import { useEffect, useState } from "react";
import { PortfolioItem } from "@/lib/types";

export default function Portfolios() {
    // all states from filter
    const portfolioName = useFilterStore((state) => state.portfolioName);
    const riskAppetite = useFilterStore((state) => state.riskAppetite);
    const triggeredAlerts = useFilterStore((state) => state.triggeredAlerts);

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
                ? portfolio.alert === triggeredAlerts
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