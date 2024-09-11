import { PortfolioData } from '@/lib/types';
import axios from 'axios'

export const viewPortfolio = async (portfolioId : string) : Promise<PortfolioData> => {
    try {
        const response = await axios.get(`http://localhost:8000/core/portfolio/${portfolioId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        throw error;
    }
}

export const createPortfolio = async () => {
    try {
        
    } catch (error) {

    }
}