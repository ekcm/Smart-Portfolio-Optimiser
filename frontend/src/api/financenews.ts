import axios from 'axios'
import { BASE_SERVER_URL, CORE_API_PATH, FINANCE_NEWS_API_PATH } from './apiFactory';
import { FinanceNewsCard, NewsArticle } from '@/lib/types';

const baseCoreNewsUrl = BASE_SERVER_URL + CORE_API_PATH + "/news";
const baseFinanceNewsUrl = BASE_SERVER_URL + FINANCE_NEWS_API_PATH;

export const viewAllNews = async() : Promise<FinanceNewsCard[]> => {
    try {
        const api = `${baseCoreNewsUrl}/all`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        console.error("Error fetching finance news: ", error);
        throw error;
    }
}

export const viewIndivNews = async(financeNewsId: string) : Promise<NewsArticle> => {
    try {
        const api = `${baseCoreNewsUrl}/${financeNewsId}`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        console.error("Error fetching finance news: ", error);
        throw error;
    }
}

// TODO: Add promise
export const viewIndivLatestNews = async(ticker: string) => {
    try {
        const api = `${baseFinanceNewsUrl}/tickers/latest`;
        const response = await axios.get(api, {
            params: { tickers: [ticker] }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching finance news: ", error);
        throw error;
    }
}