import { Injectable } from "@nestjs/common";
import { Portfolio } from "./interfaces/portfolio.model";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";

@Injectable()
export class PortfolioService {
  constructor() {}
  private portfolios = [];

  public getAllPortfolios(): Portfolio[] {
    return this.portfolios;
  }

  public getPortfolioById(portfolioId: string): Portfolio {
    return this.portfolios.find(portfolio => portfolio.portfolioId === portfolioId);
  }

  public createPortfolio(CreatePortfolioDto: CreatePortfolioDto ): Portfolio {
    const { portfolioId, portfolioClient, portfolioName, clientRiskAppetite, portfolioCashAmount } = CreatePortfolioDto;

    const portfolio: Portfolio = {
      portfolioId,
      portfolioClient,
      portfolioName,
      clientRiskAppetite,
      portfolioCashAmount,
    };
    this.portfolios.push(portfolio);
    return portfolio;
  }
}

