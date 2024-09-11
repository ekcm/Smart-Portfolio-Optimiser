import { Asset } from "@/lib/types";
import { getTodayFormattedDate } from "@/utils/utils";
import axios from "axios";

const link = "http://localhost:8000/";

export const fetchAllAssets = async () : Promise<Asset[]> => {
    try {
        const response = await axios.get(`${link}asset`);
        return response.data
    } catch (error) {
        console.error(`Error fetching assets: `, error);
        throw error;
    }
}

// TODO: Add promise
export const fetchAsset = async (ticker: string) => {
    try {
        const response = await axios.get(`${link}asset/${ticker}`);
        return response.data
    } catch (error) {
        console.error(`Error fetching asset: `, error);
        throw error;
    }
}

// TODO: Add promise
export const fetchCurrentAssetPrice = async (ticker: string) => {
    try {
        const date = getTodayFormattedDate();
        const response = await axios.get(`${link}assetprice/${ticker}/${date}`);
        console.log(response.data);
        return response.data.todayClose.toFixed(2);
    } catch (error) {
        console.error(`Error fetching stock: `, error);
        throw error;
    }
}