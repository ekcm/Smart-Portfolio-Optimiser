import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/lib/types";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";


interface GoodAlertsProps {
    type: "dashboard" | "orderForm";
    data: Alert[];
}

const GoodAlerts = memo(function GoodAlerts({ type, data }: GoodAlertsProps) {
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
    const goodAlerts = data.filter((item) => item.sentimentRating === 4 || item.sentimentRating === 5)

    return (
        <Card className="flex flex-col flex-grow w-full pt-4 pb-2 px-4 bg-red-100 gap-4">
                <div>
                    <h2 className="text-xl font-medium">Relevant News:</h2>
                    {goodAlerts.length === 0 ? 
                        <h3 className="text-md text-gray-600">No ticker alerts with low sentiment ratings!</h3>
                    :
                        <ul className="list-disc">
                            {goodAlerts
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

export default GoodAlerts;