"use client";

import { viewIndivNews } from "@/api/financenews";
import Error from "@/components/error/Error";
import Loader from "@/components/loader/Loader";
import { FinanceNewsData } from "@/lib/mockData";
import { NewsArticle } from "@/lib/types";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function FinanceNews() {
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    const pathname = usePathname();
    const financeNewsId = pathname.split("/")[2];

    const [news, setNews] = useState<NewsArticle>();

    // loaders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (financeNewsId) {
            getFinanceNews(financeNewsId);
        }
    }, [financeNewsId]);

    useEffect(() => {
        setDashBoardNavBarState("Empty");
    });

    const getFinanceNews = async (financeNewsId: string) => {
        try {
            const financeNewsData = await viewIndivNews(financeNewsId);
            console.log(financeNewsData);
            setNews(financeNewsData);
        } catch (error) {
            console.error("Error fetching finance news: ", error);
            setError("Error fetching finance news");
        } finally {
            setLoading(false);
        }
    }

    // loading state
    if (loading) {
        return (
            <Loader />
        );
    }

    if (error) return <Error error={error} />;
    // TODO: Add missing finance news data component of some sort
    if (!FinanceNewsData) return <>No Data</>;


    return (
        <main className="flex flex-col justify-between pt-6 px-24 gap-6">
            Company: {news?.company}

        </main>
    )
}