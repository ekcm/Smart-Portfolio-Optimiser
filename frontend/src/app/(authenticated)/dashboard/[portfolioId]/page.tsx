"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import MainPortfolio from "@/components/dashboard/Portfolio/MainPortfolio";
import { usePathname } from "next/navigation";
import { viewPortfolio } from "@/api/portfolio";
import { PortfolioData } from "@/lib/types";
import Loader from "@/components/loader/Loader";
import NoPortfolio from "@/components/dashboard/Portfolio/NoPortfolio";
import Error from "@/components/error/Error";
import { io, Socket } from "socket.io-client";

export default function Portfolio() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const DashBoardNavBarState = useDashBoardNavBarStore((state) => state.mainState);
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];
    const [indivPortfolioData, setIndividualPortfolio] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [socket] = useState<Socket>(() => io("http://localhost:8000"));

    useEffect(() => {
        setDashBoardNavBarState("Portfolio");
    }, [DashBoardNavBarState]);

    useEffect(() => {
        if (portfolioId) {
            getIndividualPortfolio(portfolioId);

            socket.connect();

            socket.on("connect", () => {
                console.log("Connected to WebSocket server");
            });
            
            socket.emit("subscribeToPortfolioUpdates", portfolioId);

            socket.on("portfolioUpdate", async () => {
                console.log("Portfolio update received, refreshing data...");
                await getIndividualPortfolio(portfolioId); 

                socket.emit("acknowledgeBatch");
                console.log("Acknowledgment sent for portfolio update");
            });

            socket.on("connect_error", () => {
                setError("WebSocket connection failed");
            });
            
            socket.on("disconnect", (reason) => {
                console.log("Disconnected:", reason);
            });

            return () => {
                socket.off("portfolioUpdate");
                socket.emit("unsubscribeFromPortfolioUpdates", portfolioId);
                socket.disconnect(); 
            };
        }
    }, [portfolioId, socket]);

    const getIndividualPortfolio = async (portfolioId: string) => {
        try {
            const portfolioData = await viewPortfolio(portfolioId);
            setIndividualPortfolio(portfolioData);
            console.log(portfolioData);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            setError('Failed to load portfolio data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <Error error={error} />;
    if (!indivPortfolioData) return <NoPortfolio />;

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-semibold">{indivPortfolioData.portfolioName}</h1>
                <h1 className="text-2xl font-medium">Client: {indivPortfolioData.clientName}</h1>
            </div>
            <MainPortfolio data={indivPortfolioData} />
        </main>
    );
}