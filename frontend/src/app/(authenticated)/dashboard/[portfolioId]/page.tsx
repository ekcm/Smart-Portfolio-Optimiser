"use client";

import { useEffect, useState } from "react";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import PortfolioBreakdownCard from "@/components/dashboard/Portfolio/PortfolioBreakdownCard";
import PortfolioAnalysisCard from "@/components/dashboard/Portfolio/PortfolioAnalysisCard";
import MainPortfolio from "@/components/dashboard/Portfolio/MainPortfolio";
import GoodAlerts from "@/components/dashboard/Portfolio/GoodAlerts";
import { usePathname } from "next/navigation";
import { viewPortfolio } from "@/api/portfolio";
import { PortfolioData } from "@/lib/types";
import Loader from "@/components/loader/Loader";
import NoPortfolio from "@/components/dashboard/Portfolio/NoPortfolio";
import Error from "@/components/error/Error";
import { io, Socket } from "socket.io-client";

export default function Portfolio() {
  const setDashBoardNavBarState = useDashBoardNavBarStore(
    (state) => state.setMainState
  );
  const pathname = usePathname();
  const portfolioId = pathname.split("/")[2];
  const [indivPortfolioData, setIndividualPortfolio] =
    useState<PortfolioData | null>(null);
  // loaders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [socket] = useState<Socket>(() => io("http://localhost:8000"));
  
  useEffect(() => {
    setDashBoardNavBarState("Portfolio");
  });

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
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setError("Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  const triggerBatch = () => {
    socket.emit("triggerBatch");
    console.log("Batch process triggered on the backend");
    };

  // loading state
  if (loading) {
    return <Loader />;
  }

  if (error) return <Error error={error} />;
  if (!indivPortfolioData) return <NoPortfolio />;

  return (
    <main className="flex justify-between pt-6 px-24 gap-6">
      <div className="w-1/3">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold" onClick={triggerBatch}>
            {indivPortfolioData.portfolioName}
          </h1>
          <h2 className="text-lg font-medium text-gray-600">
            Client: {indivPortfolioData.clientName}
          </h2>
        </div>
        <PortfolioAnalysisCard data={indivPortfolioData.portfolioAnalysis} />
        <PortfolioBreakdownCard data={indivPortfolioData.portfolioBreakdown} />
        <GoodAlerts type="dashboard" data={indivPortfolioData.triggeredAlerts} />
      </div>
      <div className="w-2/3">
        <MainPortfolio data={indivPortfolioData} />
      </div>
    </main>
  );
}
