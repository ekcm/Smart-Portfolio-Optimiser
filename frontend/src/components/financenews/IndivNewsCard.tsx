import { Link } from "next-view-transitions";
import { Card } from "../ui/card";
import { FinanceNewsCard } from "@/lib/types";
import SentimentRatingCustomBadge from "./SentimentRatingCustomBadge";

export type IndivNewsCardProps = {
    data: FinanceNewsCard;
}

export default function IndivNewsCard({data} : IndivNewsCardProps) {
    const formattedDate = new Date(data.date);
    const setFinanceNewsName = () => {
        localStorage.setItem("financeNews", data.company);
    }
    return (
        <Link 
            href={`/financenews/${data.id}`}
            passHref
            className="w-full"
            onClick={setFinanceNewsName}
        >
            <Card 
                className="flex flex-col w-full py-4 px-8 gap-4 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-semibold">{data.ticker}</h2>
                    </div>
                    <div>
                        <h3 className="text-md text-gray-400 whitespace-nowrap">{formattedDate.toDateString()}</h3>
                        <SentimentRatingCustomBadge amount={data.sentimentRating} />
                    </div>
                </div>
                <div className="flex items-center w-full text-justify">
                    {data.introduction}
                </div>
            </Card>
        </Link>
    )
}