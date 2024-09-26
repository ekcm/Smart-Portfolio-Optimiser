import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetPriceService } from './assetprice.service';
import { OrderDto } from 'src/dto/order.dto';
import { OrderType } from 'src/model/order.model';
import { PortfolioService } from './portfolio.service';
import { OrderStatus } from '../model/order.model';
import { ProposedPortfolio } from 'src/types';
import { RiskAppetite } from 'src/model/portfolio.model';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AssetPrice } from 'src/model/assetprice.model';

@Injectable()
export class PortfolioCreationService{

    private CASH_PERCENTAGE = 0.1
    private OPTIMIZER_URL=process.env.OPTIMIZER_URL

    constructor(private assetPriceService: AssetPriceService, private portfolioService: PortfolioService, private httpService: HttpService) {}
    
    async generateOrders(clientName: string, portfolioName: string, riskAppetite: string, cash: number, managerId: string, exclusions: string[]): Promise<ProposedPortfolio> {
        const createdPortfolio = await this.portfolioService.create({
            client: clientName,
            portfolioName: portfolioName,
            riskAppetite: RiskAppetite[riskAppetite],
            cashAmount: cash,
            assetHoldings: [],
            manager: managerId,
            exclusions: exclusions
        })
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.OPTIMIZER_URL, {
                    params: {
                        exclusions: exclusions,
                    }
                },
            ))
            const weights = response.data
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
        } catch (error) {
            throw new InternalServerErrorException('Optimizer service error')
        }
        
        return {
            portfolioId: createdPortfolio._id.toString(),
            orders: proposedOrders
        } 
    }

    async optimisePortfolio( portfolioId: string ): Promise<ProposedPortfolio> {
        var proposedOrders: OrderDto[] = []
        const portfolio = await this.portfolioService.getById(portfolioId)
        const tickers = portfolio.assetHoldings.map(assetHolding => assetHolding.ticker)
        const assetPrices = await this.assetPriceService.getLatestFrom(tickers)
        const assetPriceMap = assetPrices.reduce((map, assetPrice) => {
            map.set(assetPrice.ticker, assetPrice)
            return map
        }, new Map<string, AssetPrice>)

        var availableFunds = 0
        portfolio.assetHoldings.forEach(holding => {
           availableFunds += holding.quantity * assetPriceMap[holding.ticker].todayClose 
        })
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.OPTIMIZER_URL + "/include", {
                    params: {
                        inclusions: tickers,
                    }
                },
            ))
            const weights = response.data
            for (let ticker in weights) {
                const assetPrice = assetPriceMap[ticker]
                proposedOrders.push({
                    orderType: OrderType.BUY,
                    orderDate: new Date(),
                    assetName: ticker,
                    quantity: (availableFunds * (1 - this.CASH_PERCENTAGE) * weights[ticker]) / assetPrice.todayClose,
                    price: assetPrice.todayClose,
                    portfolioId: portfolio._id.toString(),
                    orderStatus: OrderStatus.PENDING
                })
            }
        } catch (error) {
            throw new InternalServerErrorException('Optimizer service error')
        }

        return {
            portfolioId: portfolioId,
            orders: proposedOrders
        } 
    }
}

