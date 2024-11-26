import axios from "axios";
import { BASE_SERVER_URL, ORDER_API_PATH } from "./apiFactory";
import { CreateOrderItem } from "@/lib/types";

const baseOrderUrl = BASE_SERVER_URL + ORDER_API_PATH;

export const getPortfolioOrdere = async (portfolioId: string) => {
    try {
        const response = await axios.get(`${baseOrderUrl}/${portfolioId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders: ", error);
        throw error;        
    }
}

export const createMultipleOrders = async (orders: CreateOrderItem[]) => {
    try {
        // Use Promise.all to send all requests concurrently
        const results = await Promise.all(
            orders.map(async (order) => {
                try {
                    const response = await axios.post(baseOrderUrl, order);
                    return response.data;
                } catch (error) {
                    console.error("Error creating order: ", error);
                throw error;
                }
            })
        );

        return results;
    } catch (error) {
        console.error("Error creating multiple orders: ", error);
        throw error;
    }
};