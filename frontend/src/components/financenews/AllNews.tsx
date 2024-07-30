import { FinanceNewsData } from "@/lib/mockData"
import IndivNewsCard from "./IndivNewsCard"

export default function AllNews() {
    return (
        <div className="flex flex-col items-center gap-6">
            {FinanceNewsData.map((news, index) => (
                <IndivNewsCard key={news.newsId} data={news}/>
            ))}
        </div>
    )
}