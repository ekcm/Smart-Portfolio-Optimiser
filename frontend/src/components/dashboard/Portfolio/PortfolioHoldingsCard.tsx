import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PortfolioHoldings } from "@/lib/types";

interface PortfolioHoldingsCardProps {
    data: PortfolioHoldings[]
}

export default function PortfolioHoldingsCard({ data } : PortfolioHoldingsCardProps) {
    const computePL = (PL: number) => {
        const formattedPL = Math.abs(PL).toFixed(2);
        if (PL < 0) {
            return "-$" + formattedPL;
        } else {
            return "+$" + formattedPL;
        }
    }
    const getCellClass = (value: number) => value > 0 ? 'text-green-700' : value < 0 ? 'text-red-700' : '';
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Portfolio Holdings</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol | Name</TableHead>
                        <TableHead>Security Type</TableHead>
                        <TableHead>Geography</TableHead>
                        <TableHead>Position | Mkt</TableHead>
                        <TableHead>Last | Cost</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Daily P&L</TableHead>
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
                                    <span>{item.last.toFixed(2)}</span>
                                    <span className="text-xs text-gray-500">{item.cost.toFixed(2)}</span>
                                </div>
                            </TableCell>
                            <TableCell className={getCellClass(item.totalPL)}>{computePL(item.totalPL)}</TableCell>
                            <TableCell className={getCellClass(item.dailyPL)}>{computePL(item.dailyPL)}</TableCell>
                            <TableCell>{item.positionsRatio.toFixed(2)}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>          
        </Card>
    )
}