import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/lib/types";
import SentimentRatingCustomBadge from "@/components/financenews/SentimentRatingCustomBadge";
import { Loader2 } from "lucide-react";

interface TriggeredAlertProps {
    data: Alert[];
    optimized: boolean;
    loadingState: boolean;
    onOptimise: () => void;
}

const OptimiserAlert = memo(function OptimiserAlert({ data, optimized, loadingState, onOptimise }: TriggeredAlertProps) {
    // Filter data for items with sentimentRating 1 or 2
    const breachedAlerts = data.filter((item) => item.sentimentRating === 1 || item.sentimentRating === 2);
    if (optimized) {
        return (
            <Card className="flex flex-col flex-grow items-center justify-center w-full py-4 px-4 bg-red-100 gap-2">
                <h2 className="text-xl font-medium">Triggered Alerts:</h2>
                <h3 className="text-md text-gray-600">Portfolio has been optimised</h3>
            </Card>
        );        
    }

    if (breachedAlerts.length === 0) {
        return (
            <Card className="flex flex-col flex-grow items-center justify-center w-full py-4 px-4 bg-red-100 gap-2">
                <h2 className="text-xl font-medium">Triggered Alerts:</h2>
                <h3 className="text-md text-gray-600">No alerts triggered</h3>
                {loadingState ? 
                    <Button className="w-1/2 font-medium" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Optimising
                    </Button>
                : 
                    <Button className="bg-green-600 w-1/2 font-medium" onClick={onOptimise}>Optimise Portfolio</Button>
                    }
            </Card>
        );
    };

    return (
        <Card className="flex flex-col w-5/6 h-5/6 items-center justify-center bg-red-100 gap-4">
                <h2 className="text-xl font-medium">Triggered Alerts:</h2>
                <h3 className="text-md text-gray-600">Portfolio has breached the following categories:</h3>
                <ul className="list-disc px-8">
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
                                        {/* TODO: Change this to ticker name for clarity */}
                                        {item.ticker}
                                        <SentimentRatingCustomBadge amount={item.sentimentRating} />
                                    </div>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            {loadingState ? 
                <Button className="w-1/2 font-medium" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimising
                </Button>
            : 
                <Button className="bg-red-500 w-1/2 font-medium" onClick={onOptimise}>Optimise Portfolio</Button>
            }
        </Card>
    );
});

export default OptimiserAlert;