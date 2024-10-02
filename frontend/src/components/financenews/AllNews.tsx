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
            const matchesName = newsName ? news.ticker.toLowerCase().includes(newsName.toLowerCase()) : true;
            const matchesRating = newsRating ? news.sentimentRating === newsRating : true;
            const matchesDate = newsDate ? news.date === newsDate : true;
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

    return (
        <div className="flex flex-col items-center gap-6">
            {financenews.map((news, index) => (
                <IndivNewsCard key={news.id} data={news}/>
            ))}
        </div>
    )
}