import { Card } from "@/components/ui/card";
import { AssetsItem, PortfolioHoldings } from "@/lib/types";

interface ChangeListProps {
    oldOrders: PortfolioHoldings[];
    newOrders: AssetsItem[];
}

// TODO: Calculate difference then show difference
export default function ChangeList({ oldOrders, newOrders } : ChangeListProps) {
    // TODO: Display old orders
    // TODO: Calculate difference and display new orders
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Current Portfolio Holdings</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Proposed Portfolio Holdings</h2>
                </div>
            </div>
        </Card>
    )
}