import { Injectable } from "@nestjs/common";
import { RuleType } from "src/dto/rule.dto";
import { BreachedRule, CalculatedPortfolio, PortfolioBreakdown, PortfolioRules, Securities } from "src/types";
import { RuleValidatorUtility } from "src/utilities/ruleValidatorUtility";
import { AlertService } from "./alert.service";
import { AssetHolding } from "src/model/assetholding.model";

@Injectable()
export class RuleValidatorService {

    constructor(private alertService: AlertService) { }

    async checkPortfolio(rules: PortfolioRules, cash: number, portfolioValue: number, portfolioSecurities: Securities[], exclusions: string[], assetHoldings: AssetHolding[]) : Promise<BreachedRule[]> {
        
        const breachedRules: BreachedRule[] = []

        const totalValue = portfolioValue

        if (RuleValidatorUtility.checkMinCash(rules.minCashRule.percentage, totalValue, cash) === false) {
            const recommendedTickers = await this.alertService.getSellRecommendation(assetHoldings)
            let recommendation: string;
            if (recommendedTickers.length > 0) {
                recommendation = `Run portfolio optimiser. Alternatively, here are some recommended divestments:` 
            } else {
                recommendation = `Run portfolio optimiser.` 
            }
            breachedRules.push({
                ruleType: RuleType.MIN_CASH,
                breachMessage: `Cash is below ${rules.minCashRule.percentage}% of the portfolio value`,
                recommendation: recommendation,
                news: recommendedTickers
            })
        }

        if (RuleValidatorUtility.checkMaxCash(rules.maxCashRule.percentage, totalValue, cash) === false) {
            const recommendedTickers = await this.alertService.getBuyRecommendation(exclusions, assetHoldings)
            let recommendation: string;
            if (recommendedTickers.length > 0) {
                recommendation = `Run portfolio optimiser. Alternatively, here are some recommended investments:` 
            } else {
                recommendation = `Run portfolio optimiser.` 
            }
            breachedRules.push({
                ruleType: RuleType.MAX_CASH,
                breachMessage: `Cash is above ${rules.maxCashRule.percentage}% of the portfolio value`,
                recommendation: recommendation,
                news: recommendedTickers
            })
        }

        if (RuleValidatorUtility.checkRiskComposition(rules.riskRule.stockComposition, portfolioSecurities[0]["STOCK"]||0, rules.minCashRule.percentage, rules.maxCashRule.percentage) === false) {
            breachedRules.push({
                ruleType: RuleType.RISK,
                breachMessage: `Stocks are above ${rules.riskRule.stockComposition}% of the portfolio value`,
                recommendation: `Run portfolio optimiser to rebalance the portfolio.`
            })
        }

        return breachedRules
    }

    async checkBreached(rules: PortfolioRules, cash: number, calculatedPortfolio: CalculatedPortfolio, portfolioBreakdown: PortfolioBreakdown) : Promise<boolean> {

        const totalValue = calculatedPortfolio.totalValue

        if (RuleValidatorUtility.checkMinCash(rules.minCashRule.percentage, totalValue, cash) === false) {
            return true;
        }

        if (RuleValidatorUtility.checkMaxCash(rules.maxCashRule.percentage, totalValue, cash) === false) {
            return true;
        }

        if (RuleValidatorUtility.checkRiskComposition(rules.riskRule.stockComposition, portfolioBreakdown.securities[0]["STOCK"]||0, rules.minCashRule.percentage, rules.maxCashRule.percentage) === false) {
            return true;
        }

        return false
    }

    
}