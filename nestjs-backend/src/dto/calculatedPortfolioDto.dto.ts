import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Portfolio } from 'src/model/portfolio.model';

export class CalculatedPortfolioDto<Portfolio> {
    @IsNotEmpty()
    @IsNumber()
    absoluteDailyPnl: number;

    @IsNotEmpty()
    @IsNumber()
    absolutePnl: number;

    @IsNotEmpty()
    @IsNumber()
    percentageDailyPnl: number;

    @IsNotEmpty()
    @IsNumber()
    percentagePnl: number;

    @IsNotEmpty()
    @Type(() => Portfolio)
    portfolio: Portfolio;

    @IsNotEmpty()
    @IsNumber()
    totalValue: number;
}