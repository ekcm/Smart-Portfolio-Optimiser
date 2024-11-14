import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Alert, BreachedRule, RuleType } from "@/lib/types";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";
import { ruleTypes } from "@/utils/constants";


interface TriggeredAlertProps {
    type: "dashboard" | "orderForm";
    data: Alert[];
    breachedRules: BreachedRule[];
}

const TriggeredAlert = memo(function TriggeredAlert({ type, data, breachedRules }: TriggeredAlertProps) {
    if (data.length === 0) {
        if (type === "dashboard") {
            return <></>;
        } else if (type === "orderForm") {
            return (
                <Card className="flex flex-col flex-grow w-full py-4 px-4 bg-red-100 gap-2">
                    <h2 className="text-xl font-medium">Breached Rules Alerts:</h2>
                    <h3 className="text-md text-gray-600">No alerts triggered</h3>
                </Card>
            );
        }
    }
    const breachedAlerts = data.filter((item) => item.sentimentRating === 1 || item.sentimentRating === 2)
    const usefulAlerts = data.filter((item) => item.sentimentRating === 4 || item.sentimentRating === 5)

    return (
        <Card className="flex flex-col flex-grow w-full pt-4 pb-2 px-4 bg-red-100 gap-4">
                <div>
                    <h2 className="text-xl font-medium">Breached Alerts:</h2>
                    {breachedRules.length === 0 ?
                        <h3 className="text-md text-gray-600">No alerts breached</h3>
                    :
                        <>
                            <h3 className="text-md text-gray-600">Portfolio has breached the following categories:</h3>
                            <ul className="list-disc space-y-4">
                                {breachedRules.map((rule, index) => (
                                    <li 
                                        className="text-gray-600 font-medium"
                                        key={index}
                                        style={{ listStyleType: 'none'}}
                                    >
                                        <div className="space-x-2">
                                            <span className="text-red-600">
                                                {ruleTypes.find((type) => type.value === rule.ruleType)?.label || "Unknown Rule Type"} Rule breached: 
                                            </span>
                                            <span>
                                                {rule.breachMessage}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>RECOMMENDATION: {rule.recommendation}</span>
                                            {rule.news && rule.news.length > 0 && (
                                                <div className="mt-2">
                                                    <ul className="list-disc pl-5">
                                                        {rule.news.map((newsItem, newsIndex) => (
                                                            <li key={newsIndex} className="text-gray-600">
                                                                <a href={`/financenews/${newsItem.id}`}>
                                                                    <div className="grid grid-cols-[1fr_auto] items-center gap-4 hover:bg-gray-300 transition-colors p-1">
                                                                            {newsItem.assetName} ({newsItem.ticker})
                                                                        <SentimentRatingCustomBadge amount={newsItem.sentimentRating} />
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    }
                </div>
                <div>
                    <h2 className="text-xl font-medium">Ticker Alerts:</h2>
                    {breachedAlerts.length === 0 ? 
                        <h3 className="text-md text-gray-600">No ticker alerts with low sentiment ratings!</h3>
                    :
                        <ul className="list-disc">
                            {usefulAlerts
                                .sort((a, b) => b.sentimentRating - a.sentimentRating)
                                .map((item, index) => (
                                    <li
                                        className="text-gray-600"
                                        key={index}
                                        style={{ listStyleType: 'none' }} 
                                    >
                                        <a href={`/financenews/${item.id}`}>
                                            <div className="grid grid-cols-[1fr_auto] items-center gap-4 hover:bg-gray-300 transition-colors p-1">
                                                    {item.assetName} ({item.ticker})
                                                <SentimentRatingCustomBadge amount={item.sentimentRating} />
                                            </div>
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    }
                </div>
        </Card>
    );
});

export default TriggeredAlert;