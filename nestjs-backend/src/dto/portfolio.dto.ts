import { RiskAppetite } from "../model/portfolio.model";
import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export class PortfolioDto{
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