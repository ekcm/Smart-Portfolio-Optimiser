import { Asset } from "@/lib/types";
import axios from "axios";

export const fetchAllAssets = async () : Promise<Asset[] | undefined> => {
    try {
        const response = await axios.get("http://localhost:8000/asset");
        return response.data
    } catch (error) {
        console.error(`Error fetching assets: `, error);
        throw error;
    }
}