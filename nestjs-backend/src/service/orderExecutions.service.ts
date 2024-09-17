import { Injectable } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service"; // Assuming this service provides latest asset prices
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
            const cost = quantity * order.price;

            const orderExecution: OrderExecutionProgress = {
                name: asset.name,
                ticker: order.assetName,
                type: asset.type,
                geography: asset.geography,
                position: quantity,
                market: CalculatorUtility.calculateMarketValue(todayClose, quantity),
                last: todayClose,
                cost: cost,
                orderType: order.orderType,
                progress: order.orderStatus
            };

            orderExecutions.push(orderExecution);
        }

        return orderExecutions;
    }
}