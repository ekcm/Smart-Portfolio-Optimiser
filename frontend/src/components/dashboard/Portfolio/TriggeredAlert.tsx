import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/lib/types";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";


interface TriggeredAlertProps {
    type: "dashboard" | "orderForm";
    data: Alert[];
}

const TriggeredAlert = memo(function TriggeredAlert({ type, data }: TriggeredAlertProps) {
    if (data.length === 0) {
        if (type === "dashboard") {
            return <></>;
        } else if (type === "orderForm") {
            return (
                <Card className="flex flex-col flex-grow w-full py-4 px-4 bg-red-100 gap-2">
                    <h2 className="text-xl font-medium">Triggered Alerts:</h2>
                    <h3 className="text-md text-gray-600">No alerts triggered</h3>
                </Card>
            );
        }
    }
    const breachedAlerts = data.filter((item) => item.sentimentRating === 1 || item.sentimentRating === 2)
    const usefulAlerts = data.filter((item) => item.sentimentRating === 4 || item.sentimentRating === 5)

    // TODO: Add breached alerts and useful ticker news
    return (
        <Card className="flex flex-col flex-grow w-full pt-4 pb-2 px-4 bg-red-100 gap-2">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl font-medium">Breached Alerts:</h2>
                    {breachedAlerts.length === 0 ?
                        <h3 className="text-md text-gray-600">No alerts breached</h3>
                    :
                        <>
                            <h3 className="text-md text-gray-600">Portfolio has breached the following categories:</h3>
                            <ul className="list-disc">
                                {breachedAlerts
                                    .sort((a, b) => a.sentimentRating - b.sentimentRating)
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
                        </>
                    }
                </div>
                <div>
                    <h2 className="text-xl font-medium">Useful Alerts:</h2>
                    {usefulAlerts.length === 0 ? 
                        <h3 className="text-md text-gray-600">No useful alerts as of now!</h3>
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
            </div>
        </Card>
    );
});

export default TriggeredAlert;