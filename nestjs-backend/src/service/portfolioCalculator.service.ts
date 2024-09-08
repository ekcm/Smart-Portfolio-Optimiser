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
        var valueStart: number = 0;
        var valueYesterday: number = 0;
        var valueToday: number = 0;
        var totalValue: number;

        const assetHoldings = portfolio.assetHoldings;
        for (var assetHolding of assetHoldings) {
            const assetPrice =  await this.assetPriceService.getByTickerLatest(assetHolding.ticker)
            const quantity = assetHolding.quantity
            valueStart += assetHolding.cost * quantity
            valueYesterday += assetPrice.yesterdayClose * quantity
            valueToday += assetPrice.todayClose * quantity
        }

        dailyPL = CalculatorUtility.precisionRound(valueToday - valueYesterday,2)
        totalPL = CalculatorUtility.precisionRound(valueToday - valueStart,2)

        dailyPLPercentage = CalculatorUtility.precisionRound(
            (valueToday / valueYesterday - 1) * 100, 2
        )
        totalPLPercentage = CalculatorUtility.precisionRound(
            (valueToday / valueStart - 1) * 100, 2
        )

        totalValue = CalculatorUtility.precisionRound(valueToday + portfolio.cashAmount, 2)
        
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