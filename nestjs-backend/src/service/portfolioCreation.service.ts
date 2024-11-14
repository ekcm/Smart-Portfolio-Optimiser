import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AssetHolding } from 'src/model/assetholding.model';
import { AssetPrice } from 'src/model/assetprice.model';
import { OrderType } from 'src/model/order.model';
import { RiskAppetite } from 'src/model/portfolio.model';
import { ClassicOrder, OptimisedPortfolio, ProposedPortfolio } from 'src/types';
import { OrderStatus } from '../model/order.model';
import { AssetPriceService } from './assetprice.service';
import { PortfolioService } from './portfolio.service';
import { RuleHandlerService } from './ruleHandler.service';
import { AssetService } from './asset.service';

@Injectable()
export class PortfolioCreationService{

    private CASH_PERCENTAGE = 0.1
    private OPTIMIZER_URL=process.env.OPTIMIZER_URL

    constructor(private assetPriceService: AssetPriceService, private portfolioService: PortfolioService, private httpService: HttpService, private ruleHandlerService: RuleHandlerService, private assetService: AssetService) {}
    
    async generateOrders(clientName: string, portfolioName: string, riskAppetite: string, cash: number, managerId: string, exclusions: string[], minCash: number, maxCash: number): Promise<ProposedPortfolio> {
        const createdPortfolio = await this.portfolioService.create({
            client: clientName,
            portfolioName: portfolioName,
            riskAppetite: RiskAppetite[riskAppetite],
            cashAmount: cash,
            assetHoldings: [],
            manager: managerId,
            exclusions: exclusions,
            rules: await this.ruleHandlerService.presetRules(RiskAppetite[riskAppetite], minCash, maxCash)
        })
        await this.ruleHandlerService.initialLog(createdPortfolio.exclusions, createdPortfolio.rules, createdPortfolio._id.toString(), managerId)
        const availableCash = createdPortfolio.cashAmount * (100 - (createdPortfolio.rules.minCashRule.percentage + createdPortfolio.rules.maxCashRule.percentage)/2 ) / 100
        const allowedStocks = await this.assetService.getAllStockExcept(exclusions)
        const stockTickers = allowedStocks.map(asset => asset.ticker)
        const allowedBonds = await this.assetService.getAllBondsExcept(exclusions)
        const bondTickers = allowedBonds.map(asset => asset.ticker)
        var proposedOrders: ClassicOrder[] = []
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.OPTIMIZER_URL + "/include", {
                    params: {
                        inclusions: stockTickers
                    }
                },
            ))
            const weights = response.data
            for (let ticker in weights) {
                const assetPrice = await this.assetPriceService.getByTickerLatest(ticker);
                proposedOrders.push({
                    orderType: OrderType.BUY,
                    orderDate: new Date(),
                    assetName: ticker,
                    company: assetPrice.company,
                    last: Number(assetPrice.todayClose.toFixed(2)),
                    quantity: availableCash * createdPortfolio.rules.riskRule.stockComposition/100 *weights[ticker] / assetPrice.todayClose,
                    price: assetPrice.todayClose,
                    portfolioId: createdPortfolio._id.toString(),
                    orderStatus: OrderStatus.PENDING
                })
            }
        } catch (error) {
            throw new InternalServerErrorException('Optimizer service error')
        }
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.OPTIMIZER_URL + "/include", {
                    params: {
                        inclusions: bondTickers
                    }
                },
            ))
            const weights = response.data
            for (let ticker in weights) {
                const assetPrice = await this.assetPriceService.getByTickerLatest(ticker);
                proposedOrders.push({
                    orderType: OrderType.BUY,
                    orderDate: new Date(),
                    assetName: ticker,
                    company: assetPrice.company,
                    last: Number(assetPrice.todayClose.toFixed(2)),
                    quantity: availableCash * (100 - createdPortfolio.rules.riskRule.stockComposition) / 100 * weights[ticker] / assetPrice.todayClose,
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
        const portfolioRules = portfolio.rules
        const minCash = portfolioRules.minCashRule.percentage
        const maxCash = portfolioRules.maxCashRule.percentage
        const stockTickers = []
        const bondTickers = []
        const stockComposition = portfolioRules.riskRule.stockComposition
        portfolio.assetHoldings.forEach(assetHolding => {
            if (assetHolding.assetType == "BOND") {
                bondTickers.push(assetHolding.ticker)
            } else {
                stockTickers.push(assetHolding.ticker)
            }
        });
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
        availableFunds *= (100 - ( minCash + maxCash ) / 2) / 100
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.OPTIMIZER_URL + "/include", {
                    params: {
                        inclusions: stockTickers
                    }
                },
            ))
            const stockWeights = response.data
            for (let ticker in stockWeights) {
                const assetPrice = assetPriceMap.get(ticker)
                proposedHoldings.push({
                    orderType: OrderType.BUY,
                    orderDate: new Date(),
                    assetName: ticker,
                    company: assetPrice.company,
                    last: Number(assetPrice.todayClose.toFixed(2)),
                    quantity: (availableFunds * stockComposition/100 * stockWeights[ticker]) / assetPrice.todayClose,
                    price: assetPrice.todayClose,
                    portfolioId: portfolio._id.toString(),
                    orderStatus: OrderStatus.PENDING
                })
            }
        } catch (error) {
            throw new InternalServerErrorException('Optimizer service error')
        }

        try {
            const response = await lastValueFrom(
                this.httpService.get(this.OPTIMIZER_URL + "/include", {
                    params: {
                        inclusions: bondTickers
                    }
                },
            ))
            const bondWeights = response.data
            for (let ticker in bondWeights) {
                const assetPrice = assetPriceMap.get(ticker)
                proposedHoldings.push({
                    orderType: OrderType.BUY,
                    orderDate: new Date(),
                    assetName: ticker,
                    company: assetPrice.company,
                    last: Number(assetPrice.todayClose.toFixed(2)),
                    quantity: (availableFunds * (100-stockComposition)/100 * bondWeights[ticker]) / assetPrice.todayClose,
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

