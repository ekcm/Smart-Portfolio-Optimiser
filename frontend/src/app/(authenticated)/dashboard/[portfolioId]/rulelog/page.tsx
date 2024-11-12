"use client";

import RuleCard from "@/components/dashboard/Portfolio/rulelog/RuleCard";
import { useEffect, useState } from "react";
import { getRuleLogs } from "@/api/portfolio";
import { usePathname } from "next/navigation";
import Loader from "@/components/loader/Loader";
import { RuleLog } from "@/lib/types";

export default function Rulelog() {
    const pathname = usePathname();
    const portfolioId = pathname.split("/")[2];

    // TODO: Add rulelog type
    const [logs, setLogs] = useState<RuleLog[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (portfolioId) {
            getLogs(portfolioId);
        }
    }, [portfolioId]);

    const getLogs = async (portfolioId: string) => {
        try {
            const ruleLogsData = await getRuleLogs(portfolioId);
            setLogs(ruleLogsData);
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
                    <RuleCard rule={rule}/>
                ))}
            </div>
        </main>
    )
}