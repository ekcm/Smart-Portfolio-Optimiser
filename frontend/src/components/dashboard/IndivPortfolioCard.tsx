import { Link } from "next-view-transitions";
import CustomBadge from "../global/CustomBadge";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { PortfolioItem } from "@/lib/types";

export type IndivPortfolioCardProps = {
    data: PortfolioItem;
};

export default function IndivPortfolioCard({data} : IndivPortfolioCardProps) {

    return (
        <Link 
            href={`/dashboard/${data.portfolioId}`}
            passHref
            className="w-full"
        >
            <Card 
                className="relative flex flex-row items-center justify-between w-full p-8 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
                {/* TODO: Change this to length */}
                {data.alert.length > 0 && (
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
        </Link>
    )
}