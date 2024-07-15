import { RiskAppetite } from "../portfolio.model";

export class CreatePortfolioDto{
  portfolioId: string;
  portfolioClient: string;
  portfolioName: string;
  clientRiskAppetite: RiskAppetite;
  portfolioCashAmount: number;
}