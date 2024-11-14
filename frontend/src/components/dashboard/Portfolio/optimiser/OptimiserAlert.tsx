import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, RuleReport } from "@/lib/types";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";
import { Loader2 } from "lucide-react";
import { ruleTypes } from "@/utils/constants";

interface TriggeredAlertProps {
    data: Alert[];
    ruleReport: RuleReport;
    error: string | null;
    optimized: boolean;
    loadingState: boolean;
    onOptimise: () => void;
}

const OptimiserAlert = memo(function OptimiserAlert({ data, ruleReport, error, optimized, loadingState, onOptimise }: TriggeredAlertProps) {
    // Filter data for items with sentimentRating 1 or 2
    const breachedAlerts = data.filter((item) => item.sentimentRating === 1 || item.sentimentRating === 2);
    const usefulAlerts = data.filter((item) => item.sentimentRating === 4 || item.sentimentRating === 5);
    if (optimized) {
        if (error) {
            return (
                <Card className="flex flex-col flex-grow items-center justify-center w-full py-4 px-4 bg-red-100 gap-2">
                    <h2 className="text-xl font-medium text-center">There was an issue with the optimization, please try again!</h2>
                    <h3 className="text-md text-gray-600">{error}</h3>
                    <Button className="bg-red-500 w-1/2 font-medium" onClick={onOptimise}>Optimise Portfolio</Button>
                </Card>    
            )
        }
        return (
            <Card className="flex flex-col flex-grow items-center justify-center w-full py-4 px-4 bg-red-100 gap-2">
                <h2 className="text-xl font-medium">Portfolio has been optimised</h2>
                <h3 className="text-md text-gray-600">Track your new orders below before confirming!</h3>
            </Card>
        );        
    }

    return (
        <Card className="flex flex-col w-5/6 p-4 bg-red-100 gap-4">
            <div className="max-h-5/6">
                <h2 className="text-xl font-medium">Breached Rules:</h2>
                {ruleReport.breachedRules.length === 0 ?
                    <h3 className="text-md text-gray-600">No rules breached</h3>
                :
                    <>
                        <h3 className="text-md text-gray-600">Portfolio rules has been breached in the following categories:</h3>
                        <ul className="list-disc">
                            {ruleReport.breachedRules.map((rule, index) => (
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
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-col">
                            <div className="space-x-2">
                                <span className="text-red-600 font-medium">RECOMMENDATION:</span>
                                <span>{ruleReport.recommendation}</span>
                            </div>
                            {ruleReport.news && (
                                <div className="mt-4">
                                    {ruleReport.news.buy && ruleReport.news.buy.length > 0 && (
                                        <div>
                                            <h3 className="text-md text-green-600 font-semibold">Buy Recommendations:</h3>
                                            <ul className="list-disc pl-5">
                                                {ruleReport.news.buy.map((newsItem, newsIndex) => (
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
                                    {ruleReport.news.sell && ruleReport.news.sell.length > 0 && (
                                        <div>
                                            <h3 className="text-md text-red-600 font-semibold">Sell Recommendations:</h3>
                                            <ul className="list-disc pl-5">
                                                {ruleReport.news.sell.map((newsItem, newsIndex) => (
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
                            )}
                        </div>
                    </>
                }
            </div>
            <div className="max-h-5/6">
                <h2 className="text-xl font-medium">Ticker Alerts:</h2>
                {breachedAlerts.length === 0 ? 
                    <h3 className="text-md text-gray-600">No ticker alerts with low sentiment rating as of now!</h3>
                :
                    <ul className="list-disc">
                        {breachedAlerts
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
            <div className="flex items-center justify-center">
                {loadingState ? 
                    <Button className="w-1/2 font-medium" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Optimising
                    </Button>
                : 
                <Button className="bg-red-500 w-1/2 font-medium" onClick={onOptimise}>Optimise Portfolio</Button>
            }
            </div>
        </Card>
    );
});

export default OptimiserAlert;