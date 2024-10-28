import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RuleLogDto  {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    version: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    @IsNotEmpty()
    @IsString()
    changeMessage: string;
}