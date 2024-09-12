import { Asset } from "@/lib/types";
import { getTodayFormattedDate } from "@/utils/utils";
import axios from "axios";
import { ASSET_API_PATH, ASSET_PRICE_API_PATH, BASE_SERVER_URL } from "./apiFactory";

const link = "http://localhost:8000/";
const baseAssetUrl = BASE_SERVER_URL + ASSET_API_PATH;
const baseAssetPriceUrl = BASE_SERVER_URL + ASSET_PRICE_API_PATH;

export const fetchAllAssets = async () : Promise<Asset[]> => {
    try {
        const response = await axios.get(baseAssetUrl);
        return response.data
    } catch (error) {
        console.error(`Error fetching assets: `, error);
        throw error;
    }
}

// TODO: Add promise
export const fetchAsset = async (ticker: string) => {
    try {
        const response = await axios.get(`${baseAssetUrl}/${ticker}`);
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
        const response = await axios.get(`${baseAssetPriceUrl}/${ticker}/${date}`);
        console.log(response.data);
        return response.data.todayClose.toFixed(2);
    } catch (error) {
        console.error(`Error fetching stock: `, error);
        throw error;
    }
}