import { Injectable } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service";
import { OrderExecutionProgress } from "src/types";

@Injectable()
export class OrderExecutionsService {

    constructor(
        private orderService: OrderService,
        private assetService: AssetService,
        private assetPriceService: AssetPriceService
    ) { }

    async getOrderExecutions(portfolioId: string): Promise<OrderExecutionProgress[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const orders = await this.orderService.getFilteredOrders(portfolioId, today);
        const orderExecutions: OrderExecutionProgress[] = [];


        const assetInfo = new Map<string,[string,number]>()

        const tickers = [...new Set(orders.map(order => order.assetName))]
        const namePromises = tickers.map(ticker => this.assetService.getByTicker(ticker).then(asset => asset.name));
        const pricePromises = tickers.map(ticker => this.assetPriceService.getByTickerLatest(ticker).then(assetPrice => assetPrice.todayClose));
        const names = await Promise.all(namePromises);
        const prices = await Promise.all(pricePromises);
    
        tickers.forEach((ticker, index) => {
            assetInfo.set(ticker, [names[index], prices[index]]);
          });
          

        for (const order of orders) {
            const asset = assetInfo.get(order.assetName);
            const name = asset[0];
            const last = asset[1];
            const quantity = order.quantity;

            const orderExecution: OrderExecutionProgress = {
                name: name,
                ticker: order.assetName,
                position: quantity,
                last: last,
                price: order.price,
                orderType: order.orderType,
                orderStatus: order.orderStatus,
                orderDate: order.orderDate
            };

            orderExecutions.push(orderExecution);
        }

        return orderExecutions;
    }
}