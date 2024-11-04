import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RuleType } from "src/model/rule.model";

export class RuleDto {
    @IsNotEmpty()
    @IsEnum(RuleType)
    __type: RuleType;  // Match the discriminator key

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
    stockComposition: number;

}