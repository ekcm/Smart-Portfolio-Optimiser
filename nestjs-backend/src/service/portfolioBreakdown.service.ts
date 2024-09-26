import { Injectable } from "@nestjs/common";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service";
import { Portfolio } from "src/model/portfolio.model";
import { PortfolioBreakdown } from "src/types";
import { CalculatorUtility } from '../utilities/calculatorUtility';
import { AssetPrice } from "src/model/assetprice.model";
import { Asset } from "src/model/asset.model";

@Injectable()
export class PortfolioBreakdownService{
    constructor(private assetPriceService: AssetPriceService, private assetService: AssetService) { }

    async loadPortfolio(portfolio: Portfolio): Promise<PortfolioBreakdown> {
        var industries = new Map<string, number>()
        var geographies = new Map<string, number>()
        var securities = new Map<string, number>()
        var assetHoldings = portfolio.assetHoldings
        var total = 0

        const tickers = assetHoldings.map(assetHolding => assetHolding.ticker)
        const assetPrices = await this.assetPriceService.getLatestFrom(tickers)
        const assets = await this.assetService.getAllFrom(tickers)
        console.log(assets)

        const assetPriceMap = assetPrices.reduce((map, assetPrice) => {
            map.set(assetPrice.ticker, assetPrice)
            return map
        }, new Map<string, AssetPrice>)
    


        const assetMap = assets.reduce((map, asset) => {
            map.set(asset.ticker, asset)
            return map
        }, new Map<string, Asset>)

        for (var assetHolding of assetHoldings) {
            const asset = assetMap.get(assetHolding.ticker)
            const assetPrice = assetPriceMap.get(assetHolding.ticker)
            const industry = asset.industry
            const geography = asset.geography
            const value = assetHolding.quantity * assetPrice.todayClose

            if (industries.has(industry)) {
                industries.set(industry, industries.get(industry) + value)
            } else {
                industries.set(industry, value)
            }
            if (geographies.has(geography)) {
                geographies.set(geography, geographies.get(geography) + value)
            } else {
                geographies.set(geography, value)
            }

            total += value
        }

        securities.set("stock", total);

        industries.forEach((value, industry) => {
            industries.set(industry, CalculatorUtility.precisionRound(value / total * 100, 2))
        });
        const industriesArray = Array.from(industries, ([key, value]) => ({[key]: value}))

        geographies.forEach((value, geography) => {
            geographies.set(geography, CalculatorUtility.precisionRound(value / total * 100, 2))
        });
        const geographiesArray = Array.from(geographies, ([key, value]) => ({[key]: value}))

        const securitiesArray = Array.from(securities, ([key, value]) => ({[key]: value}))


        return {
            securities: securitiesArray,
            industry: industriesArray,
            geography: geographiesArray,
        }
    }
}