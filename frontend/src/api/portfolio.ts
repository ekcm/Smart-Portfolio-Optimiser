import { CreatePortfolioForm, PortfolioData } from '@/lib/types';
import axios from 'axios';
import { BASE_SERVER_URL, REPORT_SERVER_URL, CORE_API_PATH, PORTFOLIO_API_PATH, PORTFOLIO_GENERATION_API_PATH } from './apiFactory';
import { getFormattedReportDate } from '@/utils/utils';

const baseCorePortfolioUrl = BASE_SERVER_URL + CORE_API_PATH + PORTFOLIO_API_PATH;
const basePortfolioUrl = BASE_SERVER_URL + PORTFOLIO_API_PATH;
const generatePortfolioUrl = BASE_SERVER_URL + PORTFOLIO_GENERATION_API_PATH;
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

// Create portfolio from base api
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

// Create portfolio and returns a list of suggested stock
export const createSuggestedPortfolio = async(formData: any) => {
    try {
        const api = `${generatePortfolioUrl}/proposal`;
        const queryParams = new URLSearchParams(formData).toString();
        const response = await axios.post(`${api}?${queryParams}`);
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
    }
}

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

export const getOptimisedPortfolio = async (portfolioId : string) => {
    try {
        const api = `${generatePortfolioUrl}/${portfolioId}`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        console.error('Error optimising portfolio: ' + error);
        throw error;
    }
}

// REPORT GENERATION
// TODO: Add current month as params
export const getMonthlyPortfolioReport = async(portfolioId: string, portfolioName: string | null) => {
    try {
        const api = `${REPORT_SERVER_URL}/`;
        const response = await axios.get(api, {
            responseType: 'blob' // Set response type to blob to handle the file
        });
        
        const date = getFormattedReportDate();

        const filename = `${portfolioName}_${date}`;
        // Create a blob from the response data and download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        
        // Append to the DOM, trigger the download, and clean up
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating portfolio report: ' + error);
        throw error;       
    }
}