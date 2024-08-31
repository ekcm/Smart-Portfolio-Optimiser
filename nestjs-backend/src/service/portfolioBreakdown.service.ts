import { Injectable } from "@nestjs/common";
import { AssetService } from "./asset.service";
import { AssetPriceService } from "./assetprice.service";
import { Portfolio } from "src/model/portfolio.model";

export type PortfolioBreakdown = {
    industry: { [key: string]: number | undefined}[];
    geography: { [key: string]: number | undefined}[];
    securities: { [key: string]: number | undefined}[];
};

@Injectable()
export class PortfolioBreakdownService{
    constructor(private assetPriceService: AssetPriceService, private assetService: AssetService) { }

    async loadPortfolio(portfolio: Portfolio): Promise<PortfolioBreakdown> {
        var industries = new Map<string, number>()
        var geographies = new Map<string, number>()
        var securities = new Map<string, number>()
        var assetsHoldings = portfolio.assetHoldings
        var total = 0

        for (var assetHolding of assetsHoldings) {
            const asset = await this.assetService.getByTicker(assetHolding.ticker)
            const assetPrice = await this.assetPriceService.getByTickerLatest(assetHolding.ticker)
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
            industries.set(industry, value / total)
        });
        const industriesArray = Array.from(industries, ([key, value]) => ({[key]: value}))

        geographies.forEach((value, geography) => {
            geographies.set(geography, value / total)
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