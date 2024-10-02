import IndivNewsCard from "./IndivNewsCard";
import { useFinanceNewsFilterStore } from "../../store/FinanceNewsFilterState";
import { useEffect, useState } from "react";
import { FinanceNewsCard } from "@/lib/types";
import { viewAllNews } from "@/api/financenews";
import Loader from "../loader/Loader";
import Error from "../error/Error";

// TODO: Need to add pagination when retrieving news from backend
export default function AllNews() {
    const newsName = useFinanceNewsFilterStore((state) => state.newsName);
    const newsRating = useFinanceNewsFilterStore((state) => state.newsRating);
    const newsDate = useFinanceNewsFilterStore((state) => state.newsDate);

    const [financenews, setFinanceNews] = useState<FinanceNewsCard[]>([]);
    const [filteredFinanceNews, setFilteredFinanceNews] = useState<FinanceNewsCard[]>([]);

    // loaders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getFinanceNews();
    }, []);

    // TODO: Edit filters for new types
    useEffect(() => {
        const filtered = financenews.filter((news) => {
            // Check for newsName filter
            const matchesName = newsName ? news.ticker.toLowerCase().includes(newsName.toLowerCase()) : true;
            // Check for newsRating filter (treat rating 0 as "No Filter")
            const matchesRating = newsRating !== 0 ? news.sentimentRating === newsRating : true;
            // Check for newsDate filter
            const matchesDate = newsDate ? new Date(news.date).toDateString() === new Date(newsDate).toDateString() : true;
            return matchesName && matchesRating && matchesDate;
        });

        setFilteredFinanceNews(filtered);
    }, [financenews, newsName, newsRating, newsDate]);

    const getFinanceNews = async() => {
        try {
            const data = await viewAllNews();
            setFinanceNews(data);
        } catch (error) {
            console.error("Error fetching finance news: ", error);
            setError("Failed to load finance news");
        } finally {
            setLoading(false);
        }
    }


    // loading state
    if (loading) {
        return (
            <Loader />
        )
    }

    if (error) return <Error error={error} />;
    // TODO: Add no finance news component
    if (!financenews) return <>Error!</>;
    if (filteredFinanceNews.length === 0) return <>Oops! No  finance news found for this date!</>;

    return (
        <div className="flex flex-col items-center gap-6">
            {filteredFinanceNews.map((news, index) => (
                <IndivNewsCard key={news.id} data={news}/>
            ))}
        </div>
    )
}