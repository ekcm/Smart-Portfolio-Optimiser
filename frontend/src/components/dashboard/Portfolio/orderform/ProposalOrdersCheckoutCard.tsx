import OrderTypeBadge from "@/components/global/OrderTypeBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ClassicOrder } from "@/lib/types";
import { Loader2, X } from 'lucide-react';
import { useTransitionRouter } from "next-view-transitions";

interface ProposalOrdersCheckoutCardProps {
    data: ClassicOrder[];
    ordersLoading: boolean;
    onConfirmOrder: () => void;
    onDelete: (ticker: string) => void;
}

export default function ProposalOrdersCheckoutCard({ data, ordersLoading, onConfirmOrder, onDelete }: ProposalOrdersCheckoutCardProps) {
    const router = useTransitionRouter();

    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <h2 className="text-xl font-medium">Orders Checkout</h2>
            {data.length === 0 ?
                <p className="text-gray-400">No orders to checkout</p>
                :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol | Ticker</TableHead>
                            <TableHead>Position | Price</TableHead>
                            <TableHead>Current Price</TableHead>
                            <TableHead>Total Cost</TableHead>
                            <TableHead>Direction</TableHead>
                            <TableHead>Remove</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{item.assetName}</span>
                                        <span className="text-xs text-gray-500">{item.company}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex">
                                        <span className="font-medium">{item.quantity} Share{item.quantity > 1 ? 's' : ''}</span>
                                        <span>&nbsp;@ {Number(item.price).toFixed(2)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{Number(item.last).toFixed(2)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <OrderTypeBadge orderType={item.orderType} />
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" className="hover:bg-red-500 hover:text-white" onClick={() => onDelete(item.assetName)}><X /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
            <div className="flex gap-2 mb-4">
                {ordersLoading ?     
                    <Button className="bg-red-500" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming Orders
                    </Button>
                :
                    <Button
                        type="submit"
                        className="bg-red-500"
                        onClick={onConfirmOrder}
                        >
                        Confirm Orders
                    </Button>
                }
                <Button type="button" className="bg-gray-400 text-white" onClick={(e) => {
                    e.preventDefault()
                    router.back()
                }}>
                    Cancel
                </Button>
            </div>
        </Card>
    );
}