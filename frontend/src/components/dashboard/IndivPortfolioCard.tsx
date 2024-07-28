import CustomBadge from "../global/CustomBadge";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

// Define the type for each portfolio item
export type PortfolioItem = {
    portfolioName: string;
    totalAssets: string;
    riskAppetite: string;
    dailyPL: number;
    totalPL: number;
    rateOfReturn: number;
    alert: boolean
};

// Define the props type for the IndivPortfolioCard component
export type IndivPortfolioCardProps = {
    data: PortfolioItem;
};

export default function IndivPortfolioCard({data} : IndivPortfolioCardProps) {
    
    return (
        <Card className="relative flex flex-row items-center justify-between w-full p-8">
            {data.alert && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600" />
            )}
            <div className="flex flex-col">
                <div className="flex items-start">
                    <div>
                        <h2 className="text-3xl font-semibold">{data.portfolioName}</h2>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <h3 className="text-xl whitespace-nowrap">Total assets:</h3>
                    <p className="text-xl font-bold">
                        ${data.totalAssets}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-xl whitespace-nowrap">Risk Appetite Classification High: </h3>
                    <p className="text-xl font-bold">
                        {data.riskAppetite}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 justify-end">
                    <h3 className="text-lg font-semibold">Daily P&L: </h3>
                    <CustomBadge amount={data.dailyPL}/>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <h3 className="text-lg font-semibold">Total P&L: </h3>
                    <CustomBadge amount={data.totalPL}/>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <h3 className="text-lg font-semibold">RoR: </h3>
                    <CustomBadge amount={data.rateOfReturn}/>
                </div>
            </div>
        </Card>
    )
}