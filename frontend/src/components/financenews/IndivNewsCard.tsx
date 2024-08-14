import { Link } from "next-view-transitions";
import { Card } from "../ui/card";
import { FinanceNewsItem } from "@/lib/types";

export type IndivNewsCardProps = {
    data: FinanceNewsItem;
}

export default function IndivNewsCard({data} : IndivNewsCardProps) {
    return (
        <Link 
            href={`${data.newsSourceLink}`}
            passHref
            className="w-full"
        >
            <Card 
                className="flex flex-col w-full py-4 px-8 gap-4 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-semibold">{data.newsName} - {data.newsSource}</h2>
                    </div>
                    <h3 className="text-md   text-gray-400 whitespace-nowrap">{data.newsDate}</h3>
                </div>
                <div className="flex items-center w-full text-justify">
                    {data.newsDescription}
                </div>
            </Card>
        </Link>
    )
}