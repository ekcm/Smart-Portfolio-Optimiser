import axios from 'axios'
import { BASE_SERVER_URL, CORE_API_PATH } from './apiFactory';
import { FinanceNewsCard, NewsArticle } from '@/lib/types';

const baseCoreNewsUrl = BASE_SERVER_URL + CORE_API_PATH + "/news";

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