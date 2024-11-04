import { Injectable } from "@nestjs/common";
import { CashRuleDto, RiskRuleDto } from "src/dto/rule.dto";
import { RiskAppetite } from "src/model/portfolio.model";
import { RuleType } from "src/model/rule.model";
import { PortfolioRules } from "src/types";
import { RuleLogService } from "./ruleLog.service";
import { RiskRule } from '../model/rule.model';

@Injectable()
export class RuleHandlerService {

    private readonly riskMap: Map<RiskAppetite, [string, number]> = new Map([
        [RiskAppetite.LOW, ["Low", 15]],
        [RiskAppetite.MEDIUM, ["Medium", 50]],
        [RiskAppetite.HIGH, ["High", 80]]
    ]);

    constructor(private ruleLogService: RuleLogService) { }

    async presetRules(riskAppetite: RiskAppetite, minCash: number, maxCash: number): Promise<PortfolioRules> {

        const riskRuleDto: RiskRuleDto = {
            __type: RuleType.RISK,
            name: `${this.riskMap.get(riskAppetite)[0]} Risk Rule`,
            description: `Stock composition cannot exceed ${this.riskMap.get(riskAppetite)[1]}%`,
            stockComposition: this.riskMap.get(riskAppetite)[1]
        }

        const minCashRuleDto: CashRuleDto = {
            __type: RuleType.MIN_CASH,
            name: "Minimum Cash Rule",
            description: `Cash cannot fall below ${minCash}%`,
            percentage: minCash
        }

        const maxCashRuleDto: CashRuleDto = {
            __type: RuleType.MAX_CASH,
            name: "Maximum Cash Rule",
            description: `Cash cannot exceed ${maxCash}%`,
            percentage: maxCash
        }

        return {
            minCashRule: minCashRuleDto,
            maxCashRule: maxCashRuleDto,
            riskRule: riskRuleDto
        }


    }

    async initialLog(rules: PortfolioRules, portfolioId: string): Promise<void> {

        await Promise.all([
            this.ruleLogService.create({
                description: rules.riskRule.description,
                portfolioId: portfolioId,
                ruleType: rules.riskRule.__type,
                timestamp: new Date(),
                changeMessage: "Initial Risk Rule"
            }),
            this.ruleLogService.create({
                description: rules.minCashRule.description,
                portfolioId: portfolioId,
                ruleType: rules.minCashRule.__type,
                timestamp: new Date(),
                changeMessage: "Initial Minimum Cash Rule"
            }),
            this.ruleLogService.create({
                description: rules.maxCashRule.description,
                portfolioId: portfolioId,
                ruleType: rules.maxCashRule.__type,
                timestamp: new Date(),
                changeMessage: "Initial Maximum Cash Rule"
            })
        ]);
    }

}