import { Injectable } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service";
import { OrderExecutionProgress } from "src/types";
import { CalculatorUtility } from "src/utilities/calculatorUtility";

@Injectable()
export class OrderExecutionsService {

    constructor(
        private orderService: OrderService,
        private assetService: AssetService,
        private assetPriceService: AssetPriceService
    ) { }

    async getOrderExecutions(portfolioId: string): Promise<OrderExecutionProgress[]> {
        const orders = await this.orderService.getByPortfolioId(portfolioId);
        const orderExecutions: OrderExecutionProgress[] = [];

        for (const order of orders) {
            const asset = await this.assetService.getByTicker(order.assetName);
            const assetPrice = await this.assetPriceService.getByTickerLatest(order.assetName);

            const todayClose = assetPrice.todayClose;
            const quantity = order.quantity;

            const orderExecution: OrderExecutionProgress = {
                name: asset.name,
                ticker: order.assetName,
                position: quantity,
                last: todayClose,
                price: order.price,
                orderType: order.orderType,
                orderStatus: order.orderStatus
            };

            orderExecutions.push(orderExecution);
        }

        return orderExecutions;
    }
}