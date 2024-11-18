import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PortfolioHoldingDifference } from "@/lib/types";

interface OptimisedOrdersCardProps {
    data: PortfolioHoldingDifference[];
    optimisedFlag: boolean;
}

export default function OptimisedOrdersCard({ data, optimisedFlag }: OptimisedOrdersCardProps) {
    const getCellClass = (value: number) =>
        value > 0 ? 'text-green-700 font-semibold' : value < 0 ? 'text-red-700 font-semibold' : '';

    return (
        <Card className="flex flex-col w-full p-4 gap-2 h-80 overflow-y-auto">
            {optimisedFlag ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol | Name</TableHead>
                            <TableHead>Position | Mkt</TableHead>
                            <TableHead>Last | Cost</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{item.name}</span>
                                            <span className="text-xs text-gray-500">{item.ticker}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className={getCellClass(item.difference)}>{item.position.toFixed(2)}</span>
                                            <span className="text-xs text-gray-500">{item.market.toFixed(2)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{item.last.toFixed(2)}</span>
                                            <span className="text-xs text-gray-500">{item.cost.toFixed(2)}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No changes made.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            ) : (
                <div className="flex flex-grow h-full items-center justify-center bg-gray-200">
                    <span>No changes made.</span>
                </div>
            )}
        </Card>
    );
}