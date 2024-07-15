import { Injectable } from "@nestjs/common";
import { Portfolio } from "./portfolio.model";

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

  public createPortfolio(portfolio: Portfolio): Portfolio {
    this.portfolios.push(portfolio);
    return portfolio;
  }
}

