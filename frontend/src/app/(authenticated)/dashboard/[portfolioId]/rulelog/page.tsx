"use client";

import RuleCard from "@/components/dashboard/Portfolio/rulelog/RuleCard";
import { useEffect, useState } from "react";
import { getRuleLogs } from "@/api/portfolio";
import { usePathname } from "next/navigation";
import Loader from "@/components/loader/Loader";
import { RuleLog } from "@/lib/types";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";

export default function Rulelog() {
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];

    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);

    const [logs, setLogs] = useState<RuleLog[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (portfolioId) {
            getLogs(portfolioId);
        }
    }, [portfolioId]);

    useEffect(() => {
        setDashBoardNavBarState("Rulelogger");
    }); 

    const getLogs = async (portfolioId: string) => {
        try {
            const ruleLogsData = await getRuleLogs(portfolioId);
            const sortedLogs = ruleLogsData.sort((a: { timestamp: Date; }, b: { timestamp: Date; }) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setLogs(sortedLogs);
        } catch (error) {
            console.error("Error fetching rule logs: ", error);
            setError("Error fetching rule logs");

        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <Loader />
    };

    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            <div className="space-y-4">
                {logs.map((rule, index) => (
                    <RuleCard key={index} rule={rule}/>
                ))}
            </div>
        </main>
    )
}