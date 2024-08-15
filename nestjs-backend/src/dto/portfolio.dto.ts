import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { RiskAppetite } from "../model/portfolio.model";
import { AssetHoldingDto } from "./assetholding.dto";

export class PortfolioDto {
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
  @Type(() => Number)
  portfolioCashAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetHoldingDto)
  assetHoldings: AssetHoldingDto[]
}