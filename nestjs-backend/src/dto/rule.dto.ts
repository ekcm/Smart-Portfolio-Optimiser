import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RuleType } from "src/model/rule.model";

export class RuleDto{
    @IsNotEmpty()
    @IsEnum(RuleType)
    type: RuleType;

    @IsNotEmpty()
    @IsNumber()
    threshold: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}