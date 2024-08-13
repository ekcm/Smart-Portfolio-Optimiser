import { Injectable, NotFoundException } from "@nestjs/common";
import { Portfolio } from "../model/portfolio.model";
import { PortfolioDto } from "../dto/portfolio.dto";

@Injectable()
export class PortfolioService {
  constructor() {}
  private portfolios = [];

  async getAllPortfolios(): Promise<Portfolio[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.portfolios);
      }, 1000);
    });
  }

  async getPortfolioById(portfolioId: string): Promise<{id: string}> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const portfolio = this.portfolios.find(portfolio => portfolio.portfolioId === portfolioId);
        if (portfolio) {
          resolve(portfolio);
        } else {
          reject(new NotFoundException(`Portfolio with ID ${portfolioId} not found`));
        }
      }, 1000);
    });
  }

  async createPortfolio(PortfolioDto: PortfolioDto ): Promise<void> {
    const { portfolioId, portfolioClient, portfolioName, clientRiskAppetite, portfolioCashAmount } = PortfolioDto;

    const portfolio: Portfolio = {
      portfolioId,
      portfolioClient,
      portfolioName,
      clientRiskAppetite,
      portfolioCashAmount,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        this.portfolios.push(portfolio);
        resolve();
      }, 1000);
    })
  }
}

