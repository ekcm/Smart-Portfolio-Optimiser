import { Injectable } from "@nestjs/common";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service";
import { CalculatedPortfolio, PortfolioHoldings } from "src/types";
import { Portfolio } from "src/model/portfolio.model";
import { CalculatorUtility } from "src/utilities/calculatorUtility";

@Injectable()
export class PortfolioHoldingsService {

    constructor(private assetService: AssetService, private assetPriceService: AssetPriceService) { }


    async getPortfolioHoldings(portfolio: Portfolio, portfolioCalcuations: CalculatedPortfolio): Promise<PortfolioHoldings[]> {

        const assetHoldings = portfolio.assetHoldings;
        const assetValue = portfolioCalcuations.totalValue - portfolio.cashAmount
        const portfolioHoldings: PortfolioHoldings[] = []

        for (var assetHolding of assetHoldings) {
            const asset = await this.assetService.getByTicker(assetHolding.ticker)
            const assetPrice = await this.assetPriceService.getByTickerLatest(assetHolding.ticker)

            const todayClose = assetPrice.todayClose
            const yesterdayClose = assetPrice.yesterdayClose
            const quantity = assetHolding.quantity
            const cost = assetHolding.cost

            portfolioHoldings.push({
                name: asset.name,
                ticker: assetHolding.ticker,
                type: assetHolding.assetType,
                geography: asset.geography,
                position: quantity,
                market: CalculatorUtility.calculateMarketValue(todayClose, quantity),
                last: assetPrice.todayClose,
                cost: cost,
                totalPL: CalculatorUtility.totalPL(quantity, cost, todayClose),
                totalPLPercentage: CalculatorUtility.totalPLPercentage(cost, todayClose),
                dailyPL: CalculatorUtility.dailyPL(quantity, todayClose, yesterdayClose),
                dailyPLPercentage: CalculatorUtility.dailyPLPercentage(todayClose, yesterdayClose),
                positionsRatio: CalculatorUtility.calculatePositionsRatio(todayClose, quantity, assetValue)
            });
        }

        return portfolioHoldings
    }
}