import axios from "axios";
import { BASE_SERVER_URL, TRANSACTION_API_PATH } from "./apiFactory";
import { CreateOrderItem } from "@/lib/types";

const baseTransactionUrl = BASE_SERVER_URL + TRANSACTION_API_PATH

export const createOrdersTransaction = async (portfolioId: string, orders: CreateOrderItem[]) => {
    try {
        const response = await axios.post(`${baseTransactionUrl}/orders?portfolioId=${portfolioId}`, orders);
        return response.data;
    } catch (error) {
        console.error(`Error creating orders: `, error);
        throw error;
    }
}