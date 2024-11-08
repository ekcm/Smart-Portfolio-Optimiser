import { Injectable } from "@nestjs/common";
import { RuleType } from "src/dto/rule.dto";
import { BreachedRule, CalculatedPortfolio, PortfolioBreakdown, PortfolioRules } from "src/types";
import { RuleValidatorUtility } from "src/utilities/ruleValidatorUtility";

@Injectable()
export class RuleValidatorService {

    constructor() { }

    async checkPortfolio(rules: PortfolioRules, cash: number, calculatedPortfolio: CalculatedPortfolio, portfolioBreakdown: PortfolioBreakdown) : Promise<BreachedRule[]> {
        
        const breachedRules: BreachedRule[] = []

        const totalValue = calculatedPortfolio.totalValue

        if (RuleValidatorUtility.checkMinCash(rules.minCashRule.percentage, totalValue, cash) === false) {
            breachedRules.push({
                ruleType: RuleType.MIN_CASH,
                breachMessage: `Cash is below ${rules.minCashRule.percentage}% of the portfolio value`,
                recommendation: ``
            })
        }

        if (RuleValidatorUtility.checkMaxCash(rules.maxCashRule.percentage, totalValue, cash) === false) {
            breachedRules.push({
                ruleType: RuleType.MAX_CASH,
                breachMessage: `Cash is above ${rules.maxCashRule.percentage}% of the portfolio value`,
                recommendation: ``
            })
        }

        if (RuleValidatorUtility.checkRiskComposition(rules.riskRule.stockComposition, totalValue, portfolioBreakdown.securities["STOCK"]) === false) {
            breachedRules.push({
                ruleType: RuleType.RISK,
                breachMessage: `Stocks are above ${rules.riskRule.stockComposition}% of the portfolio value`,
                recommendation: ``
            })
        }

        


        return breachedRules
    }

    
}