import axios from 'axios'

export const fetchPortfolios = async () => {
    try {
        const response = await axios.get('http://localhost:8000/core/' + 'manager')
        return response.data
    } catch (error) {
        console.error('Error fetching portfolios:', error)
        throw error
    }
}