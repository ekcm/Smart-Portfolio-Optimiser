import { Injectable } from "@nestjs/common";
import { CashRuleDto, RiskRuleDto, RuleType } from "src/dto/rule.dto";
import { RiskAppetite } from "src/model/portfolio.model";
import { PortfolioRules, UpdateRuleDto } from "src/types";
import { RuleLogService } from "./ruleLog.service";
import { PortfolioService } from "./portfolio.service";
import { PortfolioDto } from "src/dto/portfolio.dto";
import { RuleLog } from "src/model/ruleLog.model";

@Injectable()
export class RuleHandlerService {

    private readonly riskMap: Map<RiskAppetite, [string, number]> = new Map([
        [RiskAppetite.LOW, ["Low", 15]],
        [RiskAppetite.MEDIUM, ["Medium", 50]],
        [RiskAppetite.HIGH, ["High", 80]]
    ]);

    constructor(private ruleLogService: RuleLogService, private portfolioService: PortfolioService) { }

    async presetRules(riskAppetite: RiskAppetite, minCash: number, maxCash: number): Promise<PortfolioRules> {

        const percentage = this.riskMap.get(riskAppetite)[1];
        const securitiesValue = 95
        const threshold = ( percentage / securitiesValue ) * 100;

        const riskRuleDto: RiskRuleDto = {
            __type: RuleType.RISK,
            name: `${this.riskMap.get(riskAppetite)[0]} Risk Rule`,
            description: `Stock composition cannot exceed ${percentage}% of securities`,
            stockComposition: threshold
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

    async initialLog(exclusions: string[], rules: PortfolioRules, portfolioId: string, managerId: string): Promise<void> {

        if (exclusions.length > 0) {
            await this.ruleLogService.create({
                description: `Excluded assets: ${exclusions.join(", ")}`,
                portfolioId: portfolioId,
                managerId: managerId,
                ruleType: RuleType.EXCLUSIONS,
                timestamp: new Date(),
                changeMessage: "Initial Exclusions"
            })
        }

        await Promise.all([
            this.ruleLogService.create({
                description: rules.riskRule.description,
                portfolioId: portfolioId,
                managerId: managerId,
                ruleType: rules.riskRule.__type,
                timestamp: new Date(),
                changeMessage: "Initial Risk Rule"
            }),
            this.ruleLogService.create({
                description: rules.minCashRule.description,
                portfolioId: portfolioId,
                managerId: managerId,
                ruleType: rules.minCashRule.__type,
                timestamp: new Date(),
                changeMessage: "Initial Minimum Cash Rule"
            }),
            this.ruleLogService.create({
                description: rules.maxCashRule.description,
                portfolioId: portfolioId,
                managerId: managerId,
                ruleType: rules.maxCashRule.__type,
                timestamp: new Date(),
                changeMessage: "Initial Maximum Cash Rule"
            })
        ]);
    }


async updateRules(portfolioId: string, updateRuleDto: UpdateRuleDto): Promise<RuleLog> {

    const portfolio = await this.portfolioService.getById(portfolioId);
    let logDescription: string;
    let updateData: Partial<PortfolioDto> = {};

    const ruleType = updateRuleDto.ruleType;
    const rule = updateRuleDto.rule;

    switch (ruleType) {
        case "MIN_CASH":
        case "MAX_CASH":
            const percentage = typeof rule === 'number' ? rule : Number(rule);
            const ruleDescription = `Cash cannot ${ruleType === RuleType.MIN_CASH ? "fall below" : "exceed"} ${percentage}%`;
            logDescription = ruleDescription;
            
            updateData.rules = {
                ...portfolio.rules,
                [ruleType === RuleType.MIN_CASH ? "minCashRule" : "maxCashRule"]: {
                    __type: ruleType,
                    name: ruleType === RuleType.MIN_CASH ? "Minimum Cash Rule" : "Maximum Cash Rule",
                    description: ruleDescription,
                    percentage: percentage
                }
            };
            break;

        case "RISK":
            const riskAppetite = rule as RiskAppetite;

            const percentageRisk = this.riskMap.get(riskAppetite)[1];
            const securitiesValue = 95
            const threshold = ( percentageRisk / securitiesValue ) * 100;

            const riskRule = {
                __type: ruleType,
                name: `${this.riskMap.get(riskAppetite)[0]} Risk Rule`,
                description: `Stock composition cannot exceed ${percentageRisk}% of securities.`,
                stockComposition: threshold
            };
            logDescription = riskRule.description;
            
            updateData = {
                riskAppetite: riskAppetite,
                rules: {
                    ...portfolio.rules,
                    riskRule: riskRule
                }
            };
            break;

        case "EXCLUSIONS":
            const exclusions = rule as string[];
            logDescription = exclusions.length > 0 ? `Excluded assets: ${exclusions}` : "No exclusions";
            updateData = {
                exclusions
            };
            break;

        default:
            throw new Error("Invalid Rule Type");
    }
    await this.portfolioService.update(portfolioId, updateData);

    // Logging with the proper description
    return await this.ruleLogService.create({
        description: logDescription,
        portfolioId: portfolioId,
        managerId: portfolio.manager,
        ruleType: ruleType,
        timestamp: new Date(),
        changeMessage: updateRuleDto.changeMessage
    });
}


}