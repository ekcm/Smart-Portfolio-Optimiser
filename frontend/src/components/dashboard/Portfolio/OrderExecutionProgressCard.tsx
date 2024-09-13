import OrderTypeBadge from "@/components/global/OrderTypeBadge";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { OrderExecutionProgress } from "@/lib/types";

interface OrderExecutionProgressCardProps {
    data: OrderExecutionProgress[];
}

export default function OrderExecutionProgressCard({ data }: OrderExecutionProgressCardProps) {
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Order Execution Progress</h2>
            {data.length === 0 ?
                <p className="text-gray-400">No orders in progress</p>
            :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol | Ticker</TableHead>
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
                                        <span className="text-xs text-gray-500">{item.market.toFixed(2)}</span>
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
                                    <span className="font-semibold">{item.progress}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </Card>
    );
}