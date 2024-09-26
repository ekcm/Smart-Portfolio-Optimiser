import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/lib/types";


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
        <Card className="flex flex-col w-full py-4 px-4 bg-red-100 gap-2">
            <h2 className="text-xl font-medium">Triggered Alerts:</h2>
            <ul className="list-disc px-2">
                {data
                    .filter((item) => item.sentimentRating === 1 || item.sentimentRating === 5)
                    .sort((a, b) => a.sentimentRating - b.sentimentRating)
                    .map((item, index) => (
                        <li
                            className={`text-gray-600 ${item.sentimentRating === 5 ? "text-green-600" : "text-red-500"}`}
                            key={index}
                            style={{ listStyleType: 'none' }} 
                        >
                            <span className="mr-1">
                                {item.sentimentRating === 5 ? "👍" : "👎"} 
                            </span>
                            <a href={`/financenews/${item.id}`} className="hover:underline">
                                {item.ticker}
                            </a>
                        </li>
                    ))}
            </ul>
        </Card>
    );
});

export default TriggeredAlert;