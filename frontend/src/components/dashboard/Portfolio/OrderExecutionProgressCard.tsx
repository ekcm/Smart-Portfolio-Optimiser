import OrderTypeBadge from "@/components/global/OrderTypeBadge";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { OrderExecutionProgress } from "@/lib/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useState } from "react";

interface OrderExecutionProgressCardProps {
    data: OrderExecutionProgress[];
}

export default function OrderExecutionProgressCard({ data }: OrderExecutionProgressCardProps) {
    // Use a state to manage progress temporarily
    const [progressState, setProgressState] = useState<Record<string, string>>(
        data.reduce((acc, item) => ({ ...acc, [item.ticker]: item.progress }), {})
    );

    const setItemProgress = async (ticker: string, stage: string) => {
        // Optimistically update local state
        setProgressState(prev => ({ ...prev, [ticker]: stage }));

        try {
            // Send API request to change progress
            console.log(`Updating item with ticker ${ticker} to stage ${stage}`);
            // send api request to backend
            // await fetch('/api/updateProgress', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ ticker, stage }),
            // });

            // If API request is successful, no need to update state again
            // If you want to handle errors, reset the state in case of failure
        } catch (error) {
            console.error("Error updating progress:", error);
            // Revert the state to the previous value if the API request fails
            setProgressState(prev => ({ ...prev, [ticker]: data.find(item => item.ticker === ticker)?.progress || '' }));
        }
    };

    const progressStages = ["Filled", "Partial", "Not Filled"];

    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Order Execution Progress</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol | Name</TableHead>
                        <TableHead>Security Type</TableHead>
                        <TableHead>Geography</TableHead>
                        <TableHead>Position | Mkt</TableHead>
                        <TableHead>Last | Cost</TableHead>
                        <TableHead>Order Type</TableHead>
                        <TableHead>Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.ticker}>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{item.name}</span>
                                    <span className="text-xs text-gray-500">{item.ticker}</span>
                                </div>
                            </TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.geography}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{item.position}</span>
                                    <span className="text-xs text-gray-500">{item.market}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{item.last}</span>
                                    <span className="text-xs text-gray-500">{item.cost}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <OrderTypeBadge orderType={item.orderType} />
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={progressState[item.ticker]}
                                    onValueChange={(stage) => setItemProgress(item.ticker, stage)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {progressStages.map((stage) => (
                                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}