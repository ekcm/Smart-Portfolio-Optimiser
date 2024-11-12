import { CreatePortfolioForm, PortfolioData, RuleType } from '@/lib/types';
import axios from 'axios';
import { BASE_SERVER_URL, REPORT_SERVER_URL, CORE_API_PATH, PORTFOLIO_API_PATH, PORTFOLIO_GENERATION_API_PATH, RULES_API_PATH } from './apiFactory';
import { getFormattedReportDate, getMonthYearString } from '@/utils/utils';

const baseCorePortfolioUrl = BASE_SERVER_URL + CORE_API_PATH + PORTFOLIO_API_PATH;
const baseCoreRuleLogsUrl = BASE_SERVER_URL + CORE_API_PATH;
const basePortfolioUrl = BASE_SERVER_URL + PORTFOLIO_API_PATH;
const generatePortfolioUrl = BASE_SERVER_URL + PORTFOLIO_GENERATION_API_PATH;
const portfolioRulesUrl = BASE_SERVER_URL + RULES_API_PATH;

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

export const updatePortfolioRule = async(portfolioId: string, rule: any, ruleType: RuleType, changeMessage: string) => {
    try {
        const api = `${portfolioRulesUrl}/update/${portfolioId}`;
        const response = await axios.put(api,{
            ruleType: ruleType,
            rule: rule,
            changeMessage: changeMessage
        });
        return response.data;
    } catch (error) {
        console.error('Error optimising portfolio: ' + error);
        throw error;
    }
}

// Rule Log
export const getRuleLogs = async(portfolioId: string) => {
    try {
        const api = `${baseCoreRuleLogsUrl}/ruleLogs/${portfolioId}`;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        console.error('Error retrieving rule logs: ' + error);
        throw error;
    }
}

// REPORT GENERATION
export const getMonthlyPortfolioReport = async(portfolioId: string, portfolioName: string | null) => {
    try {
        const api = `${REPORT_SERVER_URL}/report?id=${portfolioId}`;
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

// TODO: Add current month as params
export const getOrdersHistoryReport = async(portfolioId: string,  portfolioName: string | null, startDate: Date | undefined, endDate: Date | undefined) => {
    try {
        const start = getMonthYearString(startDate);
        const end = getMonthYearString(endDate);
        const api = `${REPORT_SERVER_URL}/trade_executions?id=${portfolioId}&startDate=${start}&endDate=${end}`;
        const response = await axios.get(api, {
            responseType: 'blob' // Set response type to blob to handle the file
        });
        
        const date = getFormattedReportDate();

        const filename = `${portfolioName}_orders_history_${date}`;
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