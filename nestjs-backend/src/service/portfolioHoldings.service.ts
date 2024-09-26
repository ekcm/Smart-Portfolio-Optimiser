import { Injectable } from "@nestjs/common";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service";
import { CalculatedPortfolio, PortfolioHoldings } from "src/types";
import { Portfolio } from "src/model/portfolio.model";
import { CalculatorUtility } from "src/utilities/calculatorUtility";
import { AssetPrice } from "src/model/assetprice.model";
import { Asset } from "src/model/asset.model";

@Injectable()
export class PortfolioHoldingsService {

    constructor(private assetService: AssetService, private assetPriceService: AssetPriceService) { }


    async getPortfolioHoldings(portfolio: Portfolio, portfolioCalcuations: CalculatedPortfolio): Promise<PortfolioHoldings[]> {

        const assetHoldings = portfolio.assetHoldings;
        const assetValue = portfolioCalcuations.totalValue - portfolio.cashAmount
        const portfolioHoldings: PortfolioHoldings[] = []
        const tickers = assetHoldings.map(assetHolding => assetHolding.ticker)

        const assetPrices = await this.assetPriceService.getLatestFrom(tickers)
        const assetPriceMap = assetPrices.reduce((map, assetPrice) => {
            map.set(assetPrice.ticker, assetPrice)
            return map
        }, new Map<string, AssetPrice>)

        const assets = await this.assetService.getAllFrom(tickers)
        const assetMap = assets.reduce((map, asset) => {
            map.set(asset.ticker, asset)
            return map
        }, new Map<string, Asset>)

        for (var assetHolding of assetHoldings) {
            const asset = assetMap.get(assetHolding.ticker)
            const assetPrice = assetPriceMap.get(assetHolding.ticker)

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