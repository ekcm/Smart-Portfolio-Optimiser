import axios from 'axios'

export const viewPortfolio = async (portfolioId : string) => {
    try {
        const response = await axios.get(`http://localhost:8000/core/portfolio/${portfolioId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        throw error;
    }
}

export const getNames = async (portfolioId : string) => {
    try {
        const response = await axios.get(`http://localhost:8000/portfolio/${portfolioId}`);
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