"use client";

import { viewIndivNews } from "@/api/financenews";
import Error from "@/components/error/Error";
import Loader from "@/components/loader/Loader";
import { FinanceNewsData } from "@/lib/mockData";
import { NewsArticle } from "@/lib/types";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";

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
            localStorage.setItem("financeNews", financeNewsData.company);
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
    if (!news) return <>No Data</>;

    const renderInsights = (insights: any[]) => {
        return insights.map((insight, index) => {
            if (typeof insight.content === "string") {
                return (
                    <section key={index} className="my-8 border-b border-gray-300 pb-6">
                        <h1 className="text-2xl font-bold mb-4">{insight.title}</h1>
                        <p className="text-lg leading-relaxed">{insight.content}</p>
                    </section>
                );
            } else {
                return (
                    <section key={index} className="my-8 border-b border-gray-300 pb-6">
                        <h1 className="text-2xl font-bold mb-4">{insight.title}</h1>
                        {insight.content.map((nested: any, nestedIndex: number) => (
                            <div key={nestedIndex} className="mb-4">
                                <h2 className="text-xl font-semibold mb-2">{nested.subtitle}</h2>
                                <p className="text-lg leading-relaxed">{nested.content}</p>
                            </div>
                        ))}
                    </section>
                );
            }
        });
    };


    return (
        <main className="flex flex-col justify-between pt-6 px-24">
            <header className="border-b border-gray-300 pb-6">
                <h1 className="text-3xl font-bold mb-2">{news.company}</h1>
                <p className="text-lg text-gray-500 mb-4">{news.ticker}</p>
                <p className="text-lg mb-4">
                    Generated on: {
                        new Date(news.date).toLocaleDateString('en-GB', {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                </p>
                <div className="inline-block">
                    <SentimentRatingCustomBadge amount={news.sentimentRating} />
                </div>
            </header>
            <article className="prose lg:prose-xl">
                {news.insights && renderInsights(news.insights)}
            </article>
            {news.references?.length > 0 && (
                <footer className="mt-8 pb-12">
                    <h2 className="text-2xl font-bold mb-6">References</h2>
                    <ul className="space-y-4">
                        {news.references.map((reference: string, index: number) => (
                            <li key={index} className="flex items-center">
                                <span className="mr-3 text-blue-500">
                                    {/* Add an external link icon (if using any icon library like Heroicons or FontAwesome) */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5H21M21 4.5v7.5m0-7.5L10.5 15M21 19.5l-7.5-7.5M3.75 10.5v10.5h10.5"
                                        />
                                    </svg>
                                </span>
                                <a
                                    href={reference}
                                    target="_blank"
                                    className="text-md font-medium text-blue-500 hover:text-blue-700 hover:underline"
                                    rel="noopener noreferrer"
                                >
                                    {reference}
                                </a>
                            </li>
                        ))}
                    </ul>
                </footer>
            )}
        </main>
    )
}