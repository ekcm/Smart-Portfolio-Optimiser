import { PortfolioData } from "@/lib/mockData";
import IndivPortfolioCard from "./IndivPortfolioCard";
import { useDashboardFilterStore } from "@/store/DashBoardFilterState";
import { useEffect, useState } from "react";
import { PortfolioItem } from "@/lib/types";
import { fetchPortfolios } from "@/api/core";
import Loader from "../loader/Loader";

export default function Portfolios() {
    // ! TODO: Add managerId from sessionStorage for fetching portfolios api call
    const managerId = "66d9815bacb3da812c4e4c5b";
    // all states from filter
    const portfolioName = useDashboardFilterStore((state) => state.portfolioName);
    const riskAppetite = useDashboardFilterStore((state) => state.riskAppetite);
    const triggeredAlerts = useDashboardFilterStore((state) => state.triggeredAlerts);
    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
    const [filteredPortfolios, setFilteredPortfolios] = useState<PortfolioItem[]>([]);

    // loaders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPortfolios();
    }, []);

    useEffect(() => {
        // Filter the portfolio data based on the filter variables
        const filtered = portfolios.filter((portfolio) => {
            const matchesName = portfolioName
                ? portfolio.portfolioName.toLowerCase().includes(portfolioName.toLowerCase())
                : true;
            const matchesRiskAppetite = riskAppetite && riskAppetite !== "No Filter"
                ? portfolio.riskAppetite === riskAppetite
                : true;
            const matchesAlerts = triggeredAlerts
                ? portfolio.alertsPresent
                : true;

            return matchesName && matchesRiskAppetite && matchesAlerts;
        });

        setFilteredPortfolios(filtered);
    }, [portfolios, portfolioName, riskAppetite, triggeredAlerts]);

    const getPortfolios = async() => {
        try {
            const data = await fetchPortfolios(managerId);
            setPortfolios(data);
        } catch (error) {
            console.error("Error fetching portfolio: ", error);
            setError("Failed to load portfolios");
        } finally {
            setLoading(false);
        }
    }

    // loading state
    if (loading) {
        return (
            <Loader />
        )
    }

    if (error) return <div>{error}</div>;
    if (!portfolios) return <div>No portfolio data available.</div>;

    return (
        <div className="flex flex-col gap-6">
            {filteredPortfolios.map((portfolio, index) => (
                <IndivPortfolioCard key={portfolio.portfolioId} data={portfolio}/>
            ))}
        </div>
    )
}