import { Injectable } from '@nestjs/common';
import { OrderService } from './order.service';
import { PortfolioService } from './portfolio.service';
import { Order, OrderStatus } from '../model/order.model';
import { CalculatorUtility } from 'src/utilities/calculatorUtility';

@Injectable()
export class OrderFulfilmentService {
  constructor(
    private readonly orderService: OrderService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async handlePriceUpdate(message: any) {
    const { ticker, todayClose: updatedPrice } = JSON.parse(message.Body);

    const pendingOrders = await this.orderService.findPendingOrdersByTicker(ticker);

    for (const order of pendingOrders) {
      const portfolio = await this.portfolioService.getById(order.portfolioId);

      if (order.orderType === 'SELL' && order.price <= updatedPrice) {
        this.fillSellOrder(order, portfolio, updatedPrice);
      } else if (order.orderType === 'BUY' && order.price >= updatedPrice) {
        this.fillBuyOrder(order, portfolio, updatedPrice);
      }
      
      await this.orderService.updateOrderStatus(order);
      await this.portfolioService.update(portfolio.id, portfolio);
    }
  }

  private fillSellOrder(order: Order, portfolio: any, updatedPrice: number) {
    const assetHolding = portfolio.assetHoldings.find(holding => holding.ticker === order.assetName);
    if (assetHolding && assetHolding.quantity >= order.quantity) {
      order.price = updatedPrice;
      order.orderStatus = OrderStatus.FILLED;
      portfolio.cashAmount += order.price * order.quantity;
      assetHolding.quantity -= order.quantity;
      if (assetHolding.quantity === 0) {
        portfolio.assetHoldings = portfolio.assetHoldings.filter(holding => holding.ticker !== order.assetName);
      }
      
      this.updatePortfolioMetrics(portfolio, assetHolding, updatedPrice);
    }
  }

  private fillBuyOrder(order: Order, portfolio: any, updatedPrice: number) {
    if (portfolio.cashAmount >= order.price * order.quantity) {
      order.price = updatedPrice;
      order.orderStatus = OrderStatus.FILLED;
      portfolio.assetHoldings = this.addAsset(order, portfolio.assetHoldings, 'assetType');  
      portfolio.cashAmount -= order.price * order.quantity;

      const assetHolding = portfolio.assetHoldings.find(holding => holding.ticker === order.assetName);
      this.updatePortfolioMetrics(portfolio, assetHolding, updatedPrice);
    }
  }

  private addAsset(order: Order, assetHoldings: any[], assetType: string): any[] {
    const existingHolding = assetHoldings.find(holding => holding.ticker === order.assetName);
    if (existingHolding) {
      existingHolding.cost = (existingHolding.cost * existingHolding.quantity + order.price * order.quantity) / (existingHolding.quantity + order.quantity);
      existingHolding.quantity += order.quantity;
    } else {
      assetHoldings.push({
        ticker: order.assetName,
        cost: order.price,
        quantity: order.quantity,
        assetType: assetType,
      });
    }
    return assetHoldings;
  }

  private updatePortfolioMetrics(portfolio: any, assetHolding: any, updatedPrice: number) {
    const totalShares = assetHolding.quantity;
    const cost = assetHolding.cost;
    const assetValue = portfolio.assetHoldings.reduce((total, holding) => {
      const holdingPrice = updatedPrice; 
      return total + CalculatorUtility.calculateMarketValue(holdingPrice, holding.quantity);
    }, 0);

    assetHolding.totalPL = CalculatorUtility.totalPL(totalShares, cost, updatedPrice);
    assetHolding.totalPLPercentage = CalculatorUtility.totalPLPercentage(cost, updatedPrice);
    assetHolding.dailyPL = CalculatorUtility.dailyPL(totalShares, updatedPrice, assetHolding.last); 
    assetHolding.dailyPLPercentage = CalculatorUtility.dailyPLPercentage(updatedPrice, assetHolding.last);
    assetHolding.positionsRatio = CalculatorUtility.calculatePositionsRatio(updatedPrice, totalShares, assetValue);
  }
}
