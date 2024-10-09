import { Injectable, NotAcceptableException } from "@nestjs/common";
import { OrderService } from './order.service';
import { AssetPriceService } from './assetprice.service';
import { PortfolioService } from "./portfolio.service";
import { OrderDto } from '../dto/order.dto';
import { Order, OrderStatus } from "src/model/order.model";
import { AssetHolding } from "src/model/assetholding.model";
import { AssetService } from "./asset.service";

@Injectable()
export class TransactionService {
    constructor(private orderService: OrderService, private assetPriceService: AssetPriceService, private portfolioService: PortfolioService, private assetService: AssetService) { }

    async placeOrder(order: OrderDto): Promise<Order> {
        const portfolio = await this.portfolioService.getById(order.portfolioId)

        if (order.orderType === 'SELL') {
            const assetHolding = portfolio.assetHoldings.find(holding => holding.ticker === order.assetName);
            if (!assetHolding) {
                throw new NotAcceptableException("Asset not found in portfolio");
            }

            if (assetHolding.quantity < order.quantity) {
                throw new NotAcceptableException("Insufficient quantity to sell");
            }

            const assetPrice = await this.assetPriceService.getLatest(order.assetName);
            
            if (order.price <= assetPrice.todayClose) { 
                order.price = assetPrice.todayClose; 
                portfolio.cashAmount += order.price * order.quantity; 
                assetHolding.quantity -= order.quantity;

                if (assetHolding.quantity === 0) {
                    portfolio.assetHoldings = portfolio.assetHoldings.filter(holding => holding.ticker !== order.assetName);
                }

                order.orderStatus = OrderStatus.FILLED; 
            } else {
                order.orderStatus = OrderStatus.PENDING; 
            }
        } else if (order.orderType === 'BUY') {

            if (order.price * order.quantity > portfolio.cashAmount) {
                throw new NotAcceptableException("Portfolio has insufficient cash to place order")
            }
    
            const assetPrice = await this.assetPriceService.getLatest(order.assetName)
            const asset = await this.assetService.getByTicker(order.assetName)
            if (order.price >= assetPrice.todayClose) {
                order.price = assetPrice.todayClose
                portfolio.assetHoldings = this.addAsset(order, portfolio.assetHoldings, asset.type)
                portfolio.cashAmount -= order.price * order.quantity   
                order.orderStatus = OrderStatus.FILLED;             
            }
        } else {
            throw new NotAcceptableException("Invalid order type");
        }
        await this.portfolioService.update(portfolio.id, portfolio)
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
        }

        assetHoldings.push({
            ticker: order.assetName,
            cost: order.price,
            quantity: order.quantity,
            assetType: assetType
        })
        return assetHoldings
    }

    async placeOrders(orders: OrderDto[], portfolioId: string): Promise<OrderDto[]> {
        const portfolio = await this.portfolioService.getById(portfolioId)
        var totalCost = 0
        for (let i = 0; i < orders.length; i ++) {
            totalCost += orders[i].price * orders[i].quantity
        }
        if (totalCost > portfolio.cashAmount) {
            throw new NotAcceptableException("Portfolio has insufficient cash to place order")
        }
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i]

            if (order.orderType === 'SELL') {
                const assetHolding = portfolio.assetHoldings.find(holding => holding.ticker === order.assetName);
                if (!assetHolding) {
                    throw new NotAcceptableException("Asset not found in portfolio");
                }
    
                if (assetHolding.quantity < order.quantity) {
                    throw new NotAcceptableException("Insufficient quantity to sell");
                }
    
                const assetPrice = await this.assetPriceService.getLatest(order.assetName);
                
                if (order.price <= assetPrice.todayClose) { 
                    order.price = assetPrice.todayClose; 
                    portfolio.cashAmount += order.price * order.quantity; 
                    assetHolding.quantity -= order.quantity;
    
                    if (assetHolding.quantity === 0) {
                        portfolio.assetHoldings = portfolio.assetHoldings.filter(holding => holding.ticker !== order.assetName);
                    }
    
                    order.orderStatus = OrderStatus.FILLED; 
                } else {
                    order.orderStatus = OrderStatus.PENDING; 
                }
            } else if (order.orderType === 'BUY') {
                const assetPrice = await this.assetPriceService.getLatest(order.assetName);
                const asset = await this.assetService.getByTicker(order.assetName);
                if (order.price >= assetPrice.todayClose) {
                    order.price = assetPrice.todayClose;
                    portfolio.assetHoldings = this.addAsset(order, portfolio.assetHoldings, asset.type);
                    portfolio.cashAmount -= order.price * order.quantity;
                    order.orderStatus = OrderStatus.FILLED;
                }
            } else {
                throw new NotAcceptableException("Invalid order type");
            }
            const result = await this.orderService.create(order)
        }
        await this.portfolioService.update(portfolioId, portfolio)
        return orders
    }
}