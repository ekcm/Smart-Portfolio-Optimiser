import axios from 'axios'

export const fetchPortfolios = async (managerId: string) => {
    try {
        const response = await axios.get('http://localhost:8000/core/' + managerId);
        return response.data
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        throw error
    }
}