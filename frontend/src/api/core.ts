import { PortfolioItem } from '@/lib/types';
import axios from 'axios'
import { BASE_SERVER_URL, CORE_API_PATH } from './apiFactory';

const baseCoreUrl = BASE_SERVER_URL + CORE_API_PATH;
export const fetchPortfolios = async (managerId: string) : Promise<PortfolioItem[]> => {
    try {
        const response = await axios.get(baseCoreUrl + `/${managerId}`);
        return response.data
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        throw error
    }
}