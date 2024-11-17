import { Injectable } from "@nestjs/common";
import { Portfolio } from "src/model/portfolio.model";
import { AssetPriceService } from "./assetprice.service";
import { CalculatorUtility } from "src/utilities/calculatorUtility";
import { CalculatedPortfolio, intermediateAssetHolding, PortfolioValue } from "src/types";
import { AssetHolding } from "src/model/assetholding.model";

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
            ((valueToday / valueYesterday) - 1) * 100, 2
        )
        totalPLPercentage = CalculatorUtility.precisionRound(
            ((valueToday / valueStart) - 1) * 100, 2
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

    async CalculateIntermediatePortfolioValue(portfolioAssetHoldings: AssetHolding[], newAssetHoldings: intermediateAssetHolding[], intermediateCashAmount: number): Promise<number> {
        var valueStart: number = 0;
        var valueYesterday: number = 0;
        var valueToday: number = 0;
        var totalValue: number;

        // Combine asset holdings from the portfolio and the new asset holdings
        let combinedAssetHoldings: AssetHolding[] = [...portfolioAssetHoldings];

        for (const newHolding of newAssetHoldings) {
            const existingHoldingIndex = combinedAssetHoldings.findIndex(
                (holding) => holding.ticker === newHolding.ticker
            );

            if (newHolding.orderType === "Buy") {
                // If it's a "Buy", add to the existing holding or add a new holding if not found
                if (existingHoldingIndex !== -1) {
                    combinedAssetHoldings[existingHoldingIndex].quantity += newHolding.quantity;
                } else {
                    combinedAssetHoldings.push({
                        ticker: newHolding.ticker,
                        cost: newHolding.cost,
                        quantity: newHolding.quantity,
                        assetType: newHolding.assetType
                    });
                }
            } else if (newHolding.orderType === "Sell") {
                // If it's a "Sell", subtract from the existing holding
                if (existingHoldingIndex !== -1) {
                    combinedAssetHoldings[existingHoldingIndex].quantity -= newHolding.quantity;
                    // If the quantity is zero or negative, you may choose to remove it from the holdings
                    if (combinedAssetHoldings[existingHoldingIndex].quantity <= 0) {
                        combinedAssetHoldings.splice(existingHoldingIndex, 1);
                    }
                } else {
                    // If no matching holding exists, you may throw an error or handle it as needed
                    console.error(`Attempted to sell asset ${newHolding.ticker} that is not in the portfolio.`);
                }
            }
        }

        for (var assetHolding of combinedAssetHoldings) {
            const assetPrice =  await this.assetPriceService.getByTickerLatest(assetHolding.ticker)
            const quantity = assetHolding.quantity
            valueStart += assetHolding.cost * quantity
            valueYesterday += assetPrice.yesterdayClose * quantity
            valueToday += assetPrice.todayClose * quantity
        }

        totalValue = CalculatorUtility.precisionRound(valueToday + intermediateCashAmount, 2)
        
        return totalValue
    }
}