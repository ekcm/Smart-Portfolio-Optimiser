import { CreatePortfolioForm, PortfolioData } from '@/lib/types';
import axios from 'axios'
import { BASE_SERVER_URL, CORE_API_PATH, PORTFOLIO_API_PATH } from './apiFactory';

const baseCorePortfolioUrl = BASE_SERVER_URL + CORE_API_PATH + PORTFOLIO_API_PATH;
const basePortfolioUrl = BASE_SERVER_URL + PORTFOLIO_API_PATH;

export const viewPortfolio = async (portfolioId : string) : Promise<PortfolioData> => {
    try {
        const api = `${baseCorePortfolioUrl}/${portfolioId}`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio: ', error);
        throw error;
    }
}

export const viewBasicPortfolio = async (portfolioId : string) => {
    try {
        const api = `${basePortfolioUrl}/${portfolioId}`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        console.error('Error fetching basic portfolio: ' + error);
        throw error;
    }
}

export const createPortfolio = async (form: CreatePortfolioForm) => {
    try {
        const api = `${basePortfolioUrl}`;
        const response = await axios.post(api, form);
        console.log('Portfolio created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating portfolio: ' + error);
        throw error;
    }
}

export const updatePortfolioCash = async(portfolioId: string, amount: number, editType: string) => {
    try {
        const api = `${basePortfolioUrl}/${portfolioId}/cash`;
        const response = await axios.put(api, {
            "cash amount" : amount,
            "type" : editType
        });
        console.log('Portfolio cash updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating cash balance: ' + error);
        throw error;       

export const getPortfolio = async (portfolioId: string) : Promise<CreatePortfolioForm> => {
    try {
        const api = `${basePortfolioUrl}/${portfolioId}`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio: ', error);
        throw error;

    }
}