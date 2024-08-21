import { Injectable } from "@nestjs/common";
import { Portfolio } from "src/model/portfolio.model";
import { AssetPriceService } from "./assetprice.service";
import { CalculatorUtility } from "src/utilities/calculatorUtility";

type CalculatedPortfolio = {
    portfolio: Portfolio,
    absoluteDailyPnl: number,
    absolutePnl: number,
    percentageDailyPnl: number,
    percentagePnl: number,
    totalValue: number
}

@Injectable()
export class PortfolioCalculatorService {
    
    constructor(private assetPriceService: AssetPriceService) { }

    async calculatePortfolioValue(portfolio: Portfolio): Promise<CalculatedPortfolio> {
        
        var absolutePnl: number;
        var absoluteDailyPnl: number;
        var percentagePnl: number;
        var percentageDailyPnl: number;
        var valueStart: number;
        var valueYesterday: number;
        var valueToday: number;
        var totalValue: number;

        const assetHoldings = portfolio.assetHoldings;
        assetHoldings.forEach(assetHolding => {
            valueStart += assetHolding.cost
            const assetPrice = this.assetPriceService.getByTickerAndDate(assetHolding.ticker, new Date())
            assetPrice.then((result) => {
                valueYesterday += result.yesterdayClose * assetHolding.quantity
                valueToday += result.todayClose * assetHolding.quantity
            })
        });

        absoluteDailyPnl = valueToday - valueYesterday
        absolutePnl = valueToday - valueStart

        percentageDailyPnl = CalculatorUtility.precisionRound(
            (valueToday / valueYesterday - 1) * 100, 2
        )
        percentagePnl = CalculatorUtility.precisionRound(
            (valueToday / valueStart - 1) * 100, 2
        )

        totalValue = valueToday + portfolio.cashAmount

        return {
            portfolio: portfolio,
            absoluteDailyPnl: absoluteDailyPnl,
            absolutePnl: absolutePnl,
            percentageDailyPnl: percentageDailyPnl,
            percentagePnl: percentagePnl,
            totalValue: totalValue
        }
    }
}