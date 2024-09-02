import { Injectable } from "@nestjs/common";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service";
import { CalculatedPortfolio, PortfolioHoldings } from "src/types";
import { Portfolio } from "src/model/portfolio.model";
import { AssetCalculatorService } from "./assetCalculator.service";

@Injectable()
export class PortfolioHoldingsService {

    constructor(private assetService: AssetService, private assetPriceService: AssetPriceService, private assetCalculatorService: AssetCalculatorService) { }


    async getPortfolioHoldings(portfolio: Portfolio, portfolioCalcuations: CalculatedPortfolio): Promise<PortfolioHoldings[]> {

        var name: string;
        var ticker: string;
        var type: string;
        var geography: string;
        var position: number;
        var market: number;
        var last: number;
        var cost: number;
        var totalPL: number;
        var totalPLPercentage: number;
        var dailyPL: number;
        var dailyPLPercentage: number;
        var positionsRatio: number;

        const assetHoldings = portfolio.assetHoldings;
        const assetValue = portfolioCalcuations.totalValue - portfolio.cashAmount
        const portfolioHoldings: PortfolioHoldings[] = []

        for (var assetHolding of assetHoldings) {
            ticker = assetHolding.ticker
            type = assetHolding.assetType
            cost = assetHolding.cost
            position = assetHolding.quantity

            const asset = await this.assetService.getByTicker(ticker)
            name = asset.name
            geography = asset.geography

            const assetPrice = await this.assetPriceService.getByTickerLatest(ticker)
            last = assetPrice.todayClose
            market = await this.assetCalculatorService.calculateMarketValue(assetPrice, assetHolding)
            totalPL = await this.assetCalculatorService.calculateTotalPL(assetPrice, assetHolding)[0]
            totalPLPercentage = await this.assetCalculatorService.calculateTotalPL(assetPrice, assetHolding)[1]
            dailyPL = await this.assetCalculatorService.calculateDailyPL(assetPrice, assetHolding)[0]
            dailyPLPercentage = await this.assetCalculatorService.calculateDailyPL(assetPrice, assetHolding)[1]
            positionsRatio = await this.assetCalculatorService.calculatePositionsRatio(assetHolding, assetPrice, assetValue)


            portfolioHoldings.push({
                name: name,
                ticker: ticker,
                type: type,
                geography: geography,
                position: position,
                market: market,
                last: last,
                cost: cost,
                totalPL: totalPL,
                totalPLPercentage: totalPLPercentage,
                dailyPL: dailyPL,
                dailyPLPercentage: dailyPLPercentage,
                positionsRatio: positionsRatio
            });
        }

        return portfolioHoldings
    }
}