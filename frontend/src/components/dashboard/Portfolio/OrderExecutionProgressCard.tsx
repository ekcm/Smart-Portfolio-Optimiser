import { useState, useEffect } from "react";
import OrderTypeBadge from "@/components/global/OrderTypeBadge";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { OrderExecutionProgress } from "@/lib/types";

interface OrderExecutionProgressCardProps {
    data: OrderExecutionProgress[];
}

export default function OrderExecutionProgressCard({ data }: OrderExecutionProgressCardProps) {
    const [sortDirection, setSortDirection] = useState("")
    const [sortedData, setSortedData] = useState(data)

    useEffect(() => {
        setSortedData(data);
    }, [data])

    const sortByDate = () => {
        const sorted = [...data].sort((a, b) => {
            const dateA = new Date(a.orderDate).getTime()
            const dateB = new Date(b.orderDate).getTime()

            return sortDirection === "asc" ? dateA - dateB : dateB - dateA
        })

        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        setSortedData(sorted)
    }

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
                            <TableHead>Direction</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead onClick={sortByDate} className="cursor-pointer">Order Date {sortDirection === "asc" ? "↑" : "↓"}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((item, index) => (
                            <TableRow key={index}>
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
                                    <span className={`font-semibold ${item.orderStatus.toLowerCase() === 'filled' ? 'text-green-700' : 'text-yellow-600'}`}>{item.orderStatus}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{new Date(item.orderDate).toLocaleDateString()} @ {new Date(item.orderDate).toLocaleTimeString()}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </Card>
    );
}