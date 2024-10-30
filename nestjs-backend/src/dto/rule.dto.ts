import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RuleType } from "src/model/rule.model";

export class RuleDto{
    @IsNotEmpty()
    @IsEnum(RuleType)
    type: RuleType;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}

export class CashRuleDto extends RuleDto {
    @IsNotEmpty()
    @IsNumber()
    percentage: number;
}

export class RiskRuleDto extends RuleDto {
    @IsNotEmpty()
    @IsNumber()
    stocks: number;

    @IsNotEmpty()
    @IsNumber()
    bonds: number;
}