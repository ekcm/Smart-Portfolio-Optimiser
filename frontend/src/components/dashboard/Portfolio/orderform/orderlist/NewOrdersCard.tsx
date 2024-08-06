import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PortfolioHoldingsDifference } from "@/lib/types";

interface NewOrdersCardProps {
    data: PortfolioHoldingsDifference[]
}

export default function NewOrdersCard({ data } : NewOrdersCardProps) {
    const getCellClass = (value: number) => value > 0 ? 'text-green-700 font-semibold' : value < 0 ? 'text-red-700 font-semibold' : '';

    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Portfolio Holdings</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol | Name</TableHead>
                        <TableHead>Position | Mkt</TableHead>
                        <TableHead>Last | Cost</TableHead>
                        <TableHead>Positions Ratio</TableHead>
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
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className={getCellClass(item.difference)}>{item.position}</span>
                                    <span className="text-xs text-gray-500">{item.market.toFixed(2)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{item.last}</span>
                                    <span className="text-xs text-gray-500">{item.cost}</span>
                                </div>
                            </TableCell>
                            <TableCell className={getCellClass(item.difference)}>{item.positionsRatio.toFixed(2)}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>          
        </Card>
    )
}