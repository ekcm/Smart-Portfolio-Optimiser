import React from "react";
import { OrderExecutionProgress, PortfolioHoldings } from "@/lib/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import OrderTypeBadge from "./OrderTypeBadge";

interface CustomTableProps {
    data: PortfolioHoldings[] | OrderExecutionProgress[];
}


export default function CustomTable({ data }: CustomTableProps) {
    const isPortfolioHoldings = (data: any): data is PortfolioHoldings => {
        return (data as PortfolioHoldings).positionsRatio !== undefined;
    };
    
    const isHoldings = isPortfolioHoldings(data[0]);

    const getCellClass = (value: number) => value > 0 ? 'text-green-600' : value < 0 ? 'text-red-700' : '';

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Symbol | Name</TableHead>
                    <TableHead>Security Type</TableHead>
                    <TableHead>Geography</TableHead>
                    <TableHead>Position | Mkt</TableHead>
                    <TableHead>Last | Cost</TableHead>
                    {isHoldings ? (
                        <>
                            <TableHead>P&L</TableHead>
                            <TableHead>Daily P&L</TableHead>
                            <TableHead>Positions Ratio</TableHead>
                        </>
                    ) : (
                        <>
                            <TableHead>Direction</TableHead>
                            <TableHead>Order Status</TableHead>
                        </>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">
                            <div className="flex flex-col">
                                <span>{item.name}</span>
                                <span className="text-xs text-gray-500">{item.ticker}</span>
                            </div>
                        </TableCell>
                        {/* <TableCell>{item.type}</TableCell>
                        <TableCell>{item.geography}</TableCell> */}
                        <TableCell>
                            <div className="flex flex-col">
                                <span>{item.position}</span>
                                {/* <span className="text-xs text-gray-500">{item.market}</span> */}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span>{item.last}</span>
                                {/* <span className="text-xs text-gray-500">{item.cost}</span> */}
                            </div>
                        </TableCell>
                        {isHoldings ? (
                            <>
                                <TableCell className={getCellClass((item as PortfolioHoldings).totalPL)}>{(item as PortfolioHoldings).totalPL.toFixed(2)}</TableCell>
                                <TableCell className={getCellClass((item as PortfolioHoldings).dailyPL)}>{(item as PortfolioHoldings).dailyPL.toFixed(2)}</TableCell>
                                <TableCell>{(item as PortfolioHoldings).positionsRatio.toFixed(2)}%</TableCell>
                            </>
                        ) : (
                            <>
                                <TableCell>
                                    <OrderTypeBadge orderType={(item as OrderExecutionProgress).orderType} />
                                </TableCell>
                                <TableCell>
                                    {(item as OrderExecutionProgress).orderStatus}
                                </TableCell>
                            </>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}