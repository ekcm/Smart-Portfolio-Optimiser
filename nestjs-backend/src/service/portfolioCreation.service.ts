import { Injectable } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetPriceService } from './assetprice.service';
import { OrderDto } from 'src/dto/order.dto';
import { OrderType } from 'src/model/order.model';
import { PortfolioService } from './portfolio.service';
import { PortfolioDto } from 'src/dto/portfolio.dto';
import { OrderStatus } from '../model/order.model';
import { ProposedPortfolio } from 'src/types';
import { RiskAppetite } from 'src/model/portfolio.model';

@Injectable()
export class PortfolioCreationService{

    private CASH_PERCENTAGE = 0.1

    constructor(private assetService: AssetService, private assetPriceService: AssetPriceService, private portfolioService: PortfolioService) {}
    
    async generateOrders(clientName: string, portfolioName: string, riskAppetite: string, cash: number, managerId: string, exclusions: string[]): Promise<ProposedPortfolio> {
        const createdPortfolio = await this.portfolioService.create({
            client: clientName,
            portfolioName: portfolioName,
            riskAppetite: RiskAppetite[riskAppetite],
            cashAmount: cash,
            assetHoldings: [],
            manager: managerId,
            exclusions: []
        })
        const assets = await this.assetService.getAllExcept(exclusions);
        const tickers = assets.map(asset => asset.ticker);
        const weights = {'AAPL': 1}
        var proposedOrders: OrderDto[] = []
        for (let ticker in weights) {
            const assetPrice = await this.assetPriceService.getByTickerLatest(ticker);
            proposedOrders.push({
                orderType: OrderType.BUY,
                orderDate: new Date(),
                assetName: ticker,
                quantity: (createdPortfolio.cashAmount * (1 - this.CASH_PERCENTAGE) * weights[ticker]) / assetPrice.todayClose,
                price: assetPrice.todayClose,
                portfolioId: createdPortfolio._id.toString(),
                orderStatus: OrderStatus.PENDING
            })
        }

        return {
            portfolioId: createdPortfolio._id.toString(),
            orders: proposedOrders
        } 
    }
}

