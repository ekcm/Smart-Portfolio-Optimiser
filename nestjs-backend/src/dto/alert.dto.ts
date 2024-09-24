import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { GeneratedInsight } from 'src/types';

export class AlertDto {
    @IsNotEmpty()
    @IsString()
    ticker: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sentimentRating: number;

    @IsArray()
    @ValidateNested({ each: true })
    insights: GeneratedInsight[]

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    references: string[];
}
