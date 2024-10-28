import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AssetPriceService } from './assetprice.service';
import { OrderDto } from 'src/dto/order.dto';
import { Order, OrderType } from 'src/model/order.model';
import { PortfolioService } from './portfolio.service';
import { OrderStatus } from '../model/order.model';
import { ClassicOrder, OptimisedPortfolio, ProposedPortfolio } from 'src/types';
import { RiskAppetite } from 'src/model/portfolio.model';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AssetPrice } from 'src/model/assetprice.model';
import { AssetHolding } from 'src/model/assetholding.model';

@Injectable()
export class PortfolioCreationService{

    private CASH_PERCENTAGE = 0.1
    private OPTIMIZER_URL=process.env.OPTIMIZER_URL

    constructor(private assetPriceService: AssetPriceService, private portfolioService: PortfolioService, private httpService: HttpService) {}
    
    async generateOrders(clientName: string, portfolioName: string, riskAppetite: string, cash: number, managerId: string, exclusions: string[], rules: string[]): Promise<ProposedPortfolio> {
        const createdPortfolio = await this.portfolioService.create({
            client: clientName,
            portfolioName: portfolioName,
            riskAppetite: RiskAppetite[riskAppetite],
            cashAmount: cash,
            assetHoldings: [],
            manager: managerId,
            exclusions: exclusions,
            minCashPercentage: 0,
            maxCashPercentage: 100,
            ruleLogs: []
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
            var proposedOrders: ClassicOrder[] = []
            for (let ticker in weights) {
                const assetPrice = await this.assetPriceService.getByTickerLatest(ticker);
                proposedOrders.push({
                    orderType: OrderType.BUY,
                    orderDate: new Date(),
                    assetName: ticker,
                    company: assetPrice.company,
                    last: Number(assetPrice.todayClose.toFixed(2)),
                    quantity: Number(((createdPortfolio.cashAmount * (1 - this.CASH_PERCENTAGE) * weights[ticker]) / assetPrice.todayClose).toFixed(0)),
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
    
    async optimisePortfolio( portfolioId: string ): Promise<OptimisedPortfolio> {
        var proposedHoldings: ClassicOrder[] = []
        var proposedOrders: ClassicOrder[] = []
        const portfolio = await this.portfolioService.getById(portfolioId)
        const tickers = portfolio.assetHoldings.map(assetHolding => assetHolding.ticker)
        const assetPrices = await this.assetPriceService.getLatestFrom(tickers)
        const assetPriceMap = assetPrices.reduce((map, assetPrice) => {
            map.set(assetPrice.ticker, assetPrice)
            return map
        }, new Map<string, AssetPrice>)

        var availableFunds = 0
        portfolio.assetHoldings.forEach(holding => {
           availableFunds += holding.quantity * assetPriceMap.get(holding.ticker).todayClose 
        })
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.OPTIMIZER_URL + "/include", {
                    params: {
                        inclusions: tickers
                    }
                },
            ))
            const weights = response.data
            for (let ticker in weights) {
                const assetPrice = assetPriceMap.get(ticker)
                proposedHoldings.push({
                    orderType: OrderType.BUY,
                    orderDate: new Date(),
                    assetName: ticker,
                    company: assetPrice.company,
                    last: Number(assetPrice.todayClose.toFixed(2)),
                    quantity: (availableFunds * (1 - this.CASH_PERCENTAGE) * weights[ticker]) / assetPrice.todayClose,
                    price: assetPrice.todayClose,
                    portfolioId: portfolio._id.toString(),
                    orderStatus: OrderStatus.PENDING
                })
            }
        } catch (error) {
            throw new InternalServerErrorException('Optimizer service error')
        }

        const proposedHoldingsMap = proposedHoldings.reduce((map, proposedHolding) => {
            map.set(proposedHolding.assetName, proposedHolding)
            return map
        }, new Map<string, ClassicOrder>)

        const portfolioHoldingsMap = portfolio.assetHoldings.reduce((map, portfolioHolding) => {
            map.set(portfolioHolding.ticker, portfolioHolding)
            return map
        }, new Map<string, AssetHolding>)

        portfolioHoldingsMap.forEach((current, ticker) => {
            if (proposedHoldingsMap.has(ticker)) {
                const proposed = proposedHoldingsMap.get(ticker)
                const quantity = Math.abs(proposed.quantity - current.quantity)
                var orderType = OrderType.BUY
                if (proposed.quantity < current.quantity) {
                    orderType = OrderType.SELL
                }
                proposedOrders.push({
                    orderType: orderType,
                    orderDate: proposed.orderDate,
                    company: proposed.company,
                    last: proposed.last,
                    assetName: ticker,
                    quantity: quantity,
                    price: proposed.price,
                    portfolioId: portfolio._id.toString(),
                    orderStatus: OrderStatus.PENDING
                })
            } else {
                proposedOrders.push({
                    orderType: OrderType.SELL,
                    orderDate: new Date(),
                    assetName: ticker,
                    quantity: current.quantity,
                    company: assetPriceMap.get(ticker).company,
                    last: assetPriceMap.get(ticker).todayClose,
                    price: assetPriceMap.get(ticker).todayClose,
                    portfolioId: portfolio._id.toString(),
                    orderStatus: OrderStatus.PENDING
                })
            }
        });
        return {
            portfolioId: portfolioId,
            proposedHoldings: proposedHoldings,
            orders: proposedOrders
        } 
    }
}

