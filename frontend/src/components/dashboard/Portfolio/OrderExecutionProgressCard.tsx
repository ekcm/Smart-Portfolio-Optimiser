import OrderTypeBadge from "@/components/global/OrderTypeBadge";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { OrderExecutionProgress } from "@/lib/types";

interface OrderExecutionProgressCardProps {
    data: OrderExecutionProgress[];
}

export default function OrderExecutionProgressCard({ data }: OrderExecutionProgressCardProps) {
    console.log(data);
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
                            <TableHead>Position | Price</TableHead>
                            <TableHead>Current Price</TableHead>
                            <TableHead>Order Type</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Status</TableHead>
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
                                <TableCell>
                                    <div className="flex">
                                        <span className="font-medium">{item.position} Share{item.position > 1 ? 's' : ''}</span>
                                        <span>&nbsp;@ {item.price.toFixed(2)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{item.last.toFixed(2)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <OrderTypeBadge orderType={item.orderType} />
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold">{item.orderStatus}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </Card>
    );
}