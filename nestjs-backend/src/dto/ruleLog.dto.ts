import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RuleLogDto  {

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    @IsNotEmpty()
    @IsString()
    changeMessage: string;
}