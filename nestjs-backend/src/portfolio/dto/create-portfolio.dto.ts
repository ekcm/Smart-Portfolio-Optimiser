import { RiskAppetite } from "../interfaces/portfolio.model";
import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePortfolioDto{
  @IsNotEmpty()
  @IsString()
  portfolioId: string;

  @IsNotEmpty()
  @IsString()
  portfolioClient: string;

  @IsNotEmpty()
  @IsString()
  portfolioName: string;

  @IsNotEmpty()
  @IsEnum(RiskAppetite)
  clientRiskAppetite: RiskAppetite;

  @IsNotEmpty()
  @IsInt()
  portfolioCashAmount: number;
}