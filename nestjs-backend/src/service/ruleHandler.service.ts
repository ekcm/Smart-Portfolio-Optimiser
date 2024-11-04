import { Injectable } from "@nestjs/common";
import { CashRuleDto, RiskRuleDto } from "src/dto/rule.dto";
import { RiskAppetite } from "src/model/portfolio.model";
import { RuleType } from "src/model/rule.model";
import { PortfolioRules } from "src/types";
import { PortfolioService } from "./portfolio.service";
import { RuleService } from "./rule.service";

@Injectable()
export class RuleHandlerService {
    
    private readonly riskMap: Map<RiskAppetite, [string, number]> = new Map([
        [RiskAppetite.LOW, ["Low", 15]],
        [RiskAppetite.MEDIUM, ["Medium", 50]],
        [RiskAppetite.HIGH, ["High", 80]]
    ]);

    constructor(private ruleService: RuleService, private portfolioService: PortfolioService) {}

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
            minCashRule : minCashRuleDto,
            maxCashRule : maxCashRuleDto,
            riskRule : riskRuleDto
        }
    
        
    }

}