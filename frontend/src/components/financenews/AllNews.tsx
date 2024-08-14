import { FinanceNewsData } from "@/lib/mockData";
import IndivNewsCard from "./IndivNewsCard";
import { useFinanceNewsFilterStore } from "../../../store/FinanceNewsFilterState";
import { useEffect, useState } from "react";
import { FinanceNewsItem } from "@/lib/types";

// TODO: Need to add pagination when retrieving news from backend
export default function AllNews() {
    const newsName = useFinanceNewsFilterStore((state) => state.newsName);
    const newsSource = useFinanceNewsFilterStore((state) => state.newsSource);
    const newsDate = useFinanceNewsFilterStore((state) => state.newsDate);

    const [filteredFinanceNews, setFilteredFinanceNews] = useState<FinanceNewsItem[]>(FinanceNewsData);

    useEffect(() => {
        const filtered = FinanceNewsData.filter((news) => {
            const matchesName = newsName ? news.newsName.toLowerCase().includes(newsName.toLowerCase()) : true;
            const matchesSource = newsSource ? news.newsSource.toLowerCase().includes(newsSource.toLowerCase()) : true;
            const matchesDate = newsDate ? news.newsDate === newsDate : true;
            return matchesName && matchesSource && matchesDate;
        });
        setFilteredFinanceNews(filtered);
    }, [newsName, newsSource, newsDate]);

    return (
        <div className="flex flex-col items-center gap-6">
            {filteredFinanceNews.map((news, index) => (
                <IndivNewsCard key={news.newsId} data={news}/>
            ))}
        </div>
    )
}