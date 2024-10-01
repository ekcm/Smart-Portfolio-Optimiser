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

    return (
        <Card className="flex flex-col w-full pt-4 pb-2 px-4 bg-red-100 gap-2">
            <h2 className="text-xl font-medium">Triggered Alerts:</h2>
            <ul className="list-disc">
                {data
                    .filter((item) => item.sentimentRating === 1 || item.sentimentRating === 5)
                    .sort((a, b) => a.sentimentRating - b.sentimentRating)
                    .map((item, index) => (
                        <li
                            className="text-gray-600"
                            key={index}
                            style={{ listStyleType: 'none' }} 
                        >
                            <a href={`/financenews/${item.id}`}>
                                <div className="grid grid-cols-[1fr_auto] items-center gap-4 hover:bg-gray-300 transition-colors p-1">
                                        {/* TODO: Change this to ticker name for clarity */}
                                        {item.ticker}
                                    <SentimentRatingCustomBadge amount={item.sentimentRating} />
                                </div>
                            </a>
                        </li>
                    ))}
            </ul>
        </Card>
    );
});

export default TriggeredAlert;