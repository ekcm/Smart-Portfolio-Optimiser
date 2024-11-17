import { Injectable } from "@nestjs/common";
import { AlertDto } from "src/dto/alert.dto";
import { RuleType } from "src/dto/rule.dto";
import { AssetHolding } from "src/model/assetholding.model";
import { BreachedRule, CalculatedPortfolio, PortfolioBreakdown, PortfolioRules, RuleReport, Securities } from "src/types";
import { RuleValidatorUtility } from "src/utilities/ruleValidatorUtility";
import { AlertService } from "./alert.service";

@Injectable()
export class RuleValidatorService {



    constructor(private alertService: AlertService) { }

    async checkPortfolio(rules: PortfolioRules, cash: number, portfolioValue: number, portfolioSecurities: Securities[], exclusions: string[], assetHoldings: AssetHolding[]): Promise<RuleReport> {

        const breachedRules: BreachedRule[] = []
        const status: { minCash: boolean, maxCash: boolean, risk: boolean } = { minCash: false, maxCash: false, risk: false }
        const totalValue = portfolioValue

        if (RuleValidatorUtility.checkMinCash(rules.minCashRule.percentage, totalValue, cash) === false) {
            breachedRules.push({
                ruleType: RuleType.MIN_CASH,
                breachMessage: `Cash is below ${rules.minCashRule.percentage}% of the portfolio value`,
            })
            status.minCash = true
        }

        if (RuleValidatorUtility.checkMaxCash(rules.maxCashRule.percentage, totalValue, cash) === false) {
            breachedRules.push({
                ruleType: RuleType.MAX_CASH,
                breachMessage: `Cash is above ${rules.maxCashRule.percentage}% of the portfolio value`
            })
            status.maxCash = true
        }


        if (RuleValidatorUtility.checkRiskComposition(rules.riskRule.stockComposition, portfolioSecurities[0]["STOCK"] || 0, rules.minCashRule.percentage, rules.maxCashRule.percentage) === false) {
            let stockPercentage: number;
            if (rules.riskRule.stockComposition > 70) {
                stockPercentage = 80
            } else if (rules.riskRule.stockComposition > 40) {
                stockPercentage = 50
            } else {
                stockPercentage = 15
            }
            breachedRules.push({
                ruleType: RuleType.RISK,
                breachMessage: `Stocks are above ${stockPercentage}% of the portfolio value`,
            })
            status.risk = true
        }

        let recommendation: string = "Run portfolio optimiser."
        let buy: AlertDto[]
        let sell: AlertDto[]

        if (status.risk) {
            if (status.minCash) {
                sell = await this.alertService.getSellRecommendation(assetHoldings, "stock")
                if (sell.length > 0) {
                    recommendation += " Alternatively, here are some recommended stocks to sell."
                }
            }
            else if (status.maxCash) {
                buy = await this.alertService.getBuyRecommendation(exclusions, assetHoldings, "buy")
                if (buy.length > 0) {
                    recommendation += " Alternatively, here are some recommended stocks to buy."
                }
            }
            else {
                sell = await this.alertService.getSellRecommendation(assetHoldings, "stock")
                buy = await this.alertService.getBuyRecommendation(exclusions, assetHoldings, "buy")
                if (sell.length > 0 || buy.length > 0) {
                    recommendation += " Alternatively, here are some recommended securities to rebalance the portfolio."
                }
            }
        }
        else {
            if (status.minCash) {
                const sellS = await this.alertService.getSellRecommendation(assetHoldings, "stock")
                const sellB = await this.alertService.getSellRecommendation(assetHoldings, "bonds")
                sell = sellS.concat(sellB)
                if (sell.length > 0) {
                    recommendation += " Alternatively, here are some recommended securities to sell."
                }

            }
            else if (status.maxCash) {
                const buyS = await this.alertService.getBuyRecommendation(exclusions, assetHoldings, "stock")
                const buyB = await this.alertService.getBuyRecommendation(exclusions, assetHoldings, "bonds")
                buy = buyS.concat(buyB)
                if (buy.length > 0) {
                    recommendation += " Alternatively, here are some recommended securities to buy."
                }

            }
        }

        return {
            breachedRules: breachedRules,
            recommendation: recommendation,
            news: { buy: buy, sell: sell }
        }
    }

    async checkBreached(rules: PortfolioRules, cash: number, calculatedPortfolio: CalculatedPortfolio, portfolioBreakdown: PortfolioBreakdown): Promise<boolean> {

        const totalValue = calculatedPortfolio.totalValue

        if (RuleValidatorUtility.checkMinCash(rules.minCashRule.percentage, totalValue, cash) === false) {
            return true;
        }

        if (RuleValidatorUtility.checkMaxCash(rules.maxCashRule.percentage, totalValue, cash) === false) {
            return true;
        }

        if (RuleValidatorUtility.checkRiskComposition(rules.riskRule.stockComposition, portfolioBreakdown.securities[0]["STOCK"] || 0, rules.minCashRule.percentage, rules.maxCashRule.percentage) === false) {
            return true;
        }

        return false
    }


}