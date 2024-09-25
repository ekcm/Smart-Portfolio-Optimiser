import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AlertDto {

    @IsNotEmpty()
    @IsString()
    id: string;

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
    @IsString()
    introduction: string;

}
