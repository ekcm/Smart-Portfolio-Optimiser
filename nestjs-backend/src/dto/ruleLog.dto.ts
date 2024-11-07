import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RuleType } from 'src/dto/rule.dto';

export class RuleLogDto  {

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    managerId: string;
    
    @IsNotEmpty()
    @IsString()
    portfolioId: string | null;

    @IsNotEmpty()
    @IsEnum(RuleType)
    ruleType: RuleType;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    @IsNotEmpty()
    @IsString()
    changeMessage: string;
}