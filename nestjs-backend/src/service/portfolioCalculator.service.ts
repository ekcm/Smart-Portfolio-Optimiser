import { Injectable } from "@nestjs/common";
import { Portfolio } from "src/model/portfolio.model";
import { AssetPriceService } from "./assetprice.service";
import { CalculatorUtility } from "src/utilities/calculatorUtility";
import { CalculatedPortfolio } from "src/types";

@Injectable()
export class PortfolioCalculatorService {
    
    constructor(private assetPriceService: AssetPriceService) { }

    async calculatePortfolioValue(portfolio: Portfolio): Promise<CalculatedPortfolio> {
        
        var totalPL: number;
        var dailyPL: number;
        var totalPLPercentage: number;
        var dailyPLPercentage: number;
        var valueStart: number;
        var valueYesterday: number;
        var valueToday: number;
        var totalValue: number;

        const assetHoldings = portfolio.assetHoldings;
        for (var assetHolding of assetHoldings) {
            const assetPrice =  await this.assetPriceService.getByTickerLatest(assetHolding.ticker)
            valueYesterday += assetPrice.yesterdayClose * assetHolding.quantity
            valueToday += assetPrice.todayClose * assetHolding.quantity
        }

        dailyPL = valueToday - valueYesterday
        totalPL = valueToday - valueStart

        dailyPLPercentage = CalculatorUtility.precisionRound(
            (valueToday / valueYesterday - 1) * 100, 2
        )
        totalPLPercentage = CalculatorUtility.precisionRound(
            (valueToday / valueStart - 1) * 100, 2
        )

        totalValue = valueToday + portfolio.cashAmount

        return {
            portfolio: portfolio,
            dailyPL: dailyPL,
            totalPL: totalPL,
            dailyPLPercentage: dailyPLPercentage,
            totalPLPercentage: totalPLPercentage,
            totalValue: totalValue
        }
    }
}