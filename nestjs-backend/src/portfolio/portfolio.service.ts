import { Injectable } from "@nestjs/common";
import { Portfolio } from "./portfolio.model";

@Injectable()
export class PortfolioService {
  constructor() {}
  private portfolios = [];

  public getAllPortfolios(): Portfolio[] {
    return this.portfolios;
  }

  public createPortfolio(portfolio: Portfolio): Portfolio {
    this.portfolios.push(portfolio);
    return portfolio;
  }
}

