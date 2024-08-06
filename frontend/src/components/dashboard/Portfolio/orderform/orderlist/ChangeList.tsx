import { Card } from "@/components/ui/card";
import { PortfolioHoldings, PortfolioHoldingsDifference } from "@/lib/types";
import OldOrdersCard from "./OldOrdersCard";
import NewOrdersCard from "./NewOrdersCard";

interface ChangeListProps {
    oldOrders: PortfolioHoldings[];
    newOrders: PortfolioHoldingsDifference[];
}

export default function ChangeList({ oldOrders, newOrders }: ChangeListProps) {
    return (
        <Card className="flex flex-col w-full p-4 gap-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Current Portfolio Holdings</h2>
                    <OldOrdersCard data={oldOrders} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">Proposed Portfolio Holdings</h2>
                    <NewOrdersCard data={newOrders} />
                </div>
            </div>
        </Card>
    )
}