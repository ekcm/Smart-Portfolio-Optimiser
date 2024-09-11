import { Injectable, NotAcceptableException } from "@nestjs/common";
import { OrderService } from './order.service';
import { AssetPriceService } from './assetprice.service';
import { PortfolioService } from "./portfolio.service";
import { OrderDto } from '../dto/order.dto';
import { Order, OrderStatus } from "src/model/order.model";
import { AssetHolding } from "src/model/assetholding.model";
import { Asset, AssetType } from "src/model/asset.model";
import { AssetService } from "./asset.service";

@Injectable()
export class TransactionService {
    constructor(private orderService: OrderService, private assetPriceService: AssetPriceService, private portfolioService: PortfolioService, private assetService: AssetService) { }

    async placeOrder(order: OrderDto): Promise<Order> {
        const portfolio = await this.portfolioService.getById(order.portfolioId)
        if (order.price * order.quantity > portfolio.cashAmount) {
            throw new NotAcceptableException("Portfolio has insufficient cash to place order")
        }

        const assetPrice = await this.assetPriceService.getLatest(order.assetName)
        const asset = await this.assetService.getByTicker(order.assetName)
        if (order.price >= assetPrice.todayClose) {
            order.price = assetPrice.todayClose
            portfolio.assetHoldings = this.addAsset(order, portfolio.assetHoldings, asset.type)
            await this.portfolioService.update(portfolio.id, portfolio)
            order.orderStatus = OrderStatus.FILLED
        }
        const result = await this.orderService.create(order)
        return result
    }

    private addAsset(order: OrderDto, assetHoldings: AssetHolding[], assetType: string): AssetHolding[] {
        for (var i = 0; i < assetHoldings.length; i++) {
            if (assetHoldings[i].ticker == order.assetName) {
                assetHoldings[i].cost = (assetHoldings[i].cost * assetHoldings[i].quantity + order.price * order.quantity) / (assetHoldings[i].quantity + order.quantity)
                assetHoldings[i].quantity = assetHoldings[i].quantity + order.quantity
                return assetHoldings
            }
            assetHoldings.push({
                ticker: order.assetName,
                cost: order.price,
                quantity: order.quantity,
                assetType: assetType
            })
            return assetHoldings
        }
    }
}