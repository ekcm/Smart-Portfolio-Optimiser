import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class PortfolioRuleDto {
    @IsNotEmpty()
    @IsString()
    portfolioId: string;

    @IsArray()
    rules: ObjectId[];
}