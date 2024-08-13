import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TriggeredAlertProps {
    data: string[];
    optimized: boolean;
    onOptimise: () => void;
}

const OptimiserAlert = memo(function OptimiserAlert({ data, optimized , onOptimise }: TriggeredAlertProps) {
    if (optimized) {
        return (
            <Card className="flex flex-col flex-grow items-center justify-center w-full py-4 px-4 bg-red-100 gap-2">
                <h2 className="text-xl font-medium">Triggered Alerts:</h2>
                <h3 className="text-md text-gray-600">Portfolio has been optimised</h3>
            </Card>
        );        
    }

    if (data.length === 0) {
        return (
            <Card className="flex flex-col flex-grow items-center justify-center w-full py-4 px-4 bg-red-100 gap-2">
                <h2 className="text-xl font-medium">Triggered Alerts:</h2>
                <h3 className="text-md text-gray-600">No alerts triggered</h3>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col w-5/6 h-5/6 items-center justify-center bg-red-100 gap-4">
                <h2 className="text-xl font-medium">Triggered Alerts:</h2>
                <h3 className="text-md text-gray-600">Portfolio has breached the following categories:</h3>
                <ul className="list-disc px-8">
                    {data.map((item, index) => (
                        <li className="text-gray-600" key={index}>{item}</li>
                    ))}
                </ul>
            <Button className="bg-red-500 w-1/2 font-medium" onClick={onOptimise}>Optimise Portfolio</Button>
        </Card>
    );
});

export default OptimiserAlert;