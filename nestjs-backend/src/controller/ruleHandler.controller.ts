import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';
import { RuleHandlerService } from 'src/service/ruleHandler.service';
import { RiskAppetite } from 'src/model/portfolio.model';
import { IsEnum, IsNumber, Min, Max } from 'class-validator';
import { CashRuleDto, RiskRuleDto } from 'src/dto/rule.dto';
import { PortfolioRules } from 'src/types';

// DTO for request validation
export class PresetRulesDto {
    @ApiProperty({
        enum: RiskAppetite,
        example: RiskAppetite.MEDIUM,
        description: 'Risk appetite level for the portfolio'
    })
    @IsEnum(RiskAppetite)
    riskAppetite: RiskAppetite;

    @ApiProperty({
        example: 5,
        minimum: 0,
        maximum: 100,
        description: 'Minimum cash percentage allowed in portfolio'
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    minCash: number;

    @ApiProperty({
        example: 20,
        minimum: 0,
        maximum: 100,
        description: 'Maximum cash percentage allowed in portfolio'
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    maxCash: number;
}

// Response class for Swagger
export class PortfolioRulesResponse {
    @ApiProperty({ type: () => CashRuleDto })
    minCashRule: CashRuleDto;

    @ApiProperty({ type: () => CashRuleDto })
    maxCashRule: CashRuleDto;

    @ApiProperty({ type: () => RiskRuleDto })
    riskRule: RiskRuleDto;
}

@Controller('rules')
@ApiTags('Portfolio Rules')
export class RuleHandlerController {
    constructor(private readonly ruleHandlerService: RuleHandlerService) {}

    @Post('preset')
    @ApiOperation({
        summary: 'Create preset portfolio rules',
        description: 'Creates a set of portfolio rules based on risk appetite and cash limits'
    })
    @ApiBody({ type: PresetRulesDto })
    @ApiResponse({
        status: 201,
        description: 'Rules created successfully',
        type: PortfolioRulesResponse
    })
    async createPresetRules(
        @Body() presetRulesDto: PresetRulesDto
    ): Promise<PortfolioRulesResponse> {
        return this.ruleHandlerService.presetRules(
            presetRulesDto.riskAppetite,
            presetRulesDto.minCash,
            presetRulesDto.maxCash
        );
    }

    @Post('initial-log/:portfolioId')
    async createInitialLog(
        @Param('portfolioId') portfolioId: string,
        @Body('rules') rules: PortfolioRules
    ): Promise<void> {
        await this.ruleHandlerService.initialLog(rules, portfolioId);
    }
}