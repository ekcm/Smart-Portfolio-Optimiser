import { Injectable } from "@nestjs/common";
import { Portfolio } from "src/model/portfolio.model";
import { PortfolioService } from "./portfolio.service";
import { PortfolioCalculatorService } from "./portfolioCalculator.service";
import { PortfolioBreakdown, PortfolioBreakdownService } from './portfolioBreakdown.service';

export type DashboardCard = {
    portfolioId: string,
    clientName: string,
    portfolioName: string,
    riskAppetite: string,
    totalValue: number,
    absolutePnl: number,
    absoluteDailyPnl: number,
    percentagePnl: number,
    percentageDailyPnl: number,
    // alertsPresent: boolean
}

export type PortfolioData = {
    portfolioId: number;
    portfolioAnalysis: PortfolioAnalysis;
    triggeredAlerts: string[];
    portfolioBreakdown: PortfolioBreakdown;
    portfolioHoldings: [];
    orderExecutionProgress: [];
  };

export type PortfolioAnalysis = {
    totalAssets: number;
    dailyPL: number;
    dailyPLPercentage: number;
    totalPL: number;
    totalPLPercentage: number;
    annualizedRoR: number;
};

@Injectable()
export class CoreService {
    constructor(private portfolioService: PortfolioService, private portfolioCalculatorService: PortfolioCalculatorService, private portfolioBreakdownService: PortfolioBreakdownService) { }


    async loadHomepage(managerId: string): Promise<DashboardCard[]> {
        const portfolios: Portfolio[] = await this.portfolioService.getByManager(managerId)
        const portfolioCards: DashboardCard[] = []

        for (const portfolio of portfolios) {
            const portfolioCalculations = await this.portfolioCalculatorService.calculatePortfolioValue(portfolio)

            portfolioCards.push({
                portfolioId: portfolio._id.toString(),
                clientName: portfolio.client,
                portfolioName: portfolio.portfolioName,
                riskAppetite: portfolio.riskAppetite,
                totalValue: portfolioCalculations.totalValue,
                absolutePnl: portfolioCalculations.absolutePnl,
                absoluteDailyPnl: portfolioCalculations.absoluteDailyPnl,
                percentagePnl: portfolioCalculations.percentagePnl,
                percentageDailyPnl: portfolioCalculations.percentageDailyPnl,
                // alertsPresent: boolean
            });
        }
        return portfolioCards
    }

    async loadPortfolio(portfolioId: string): Promise<PortfolioData> {
        const portfolio = await this.portfolioService.getById(portfolioId)
        const portfolioBreakdown = await this.portfolioBreakdownService.loadPortfolio(portfolio)
        const portfolioCalculations = await this.portfolioCalculatorService.calculatePortfolioValue(portfolio)
        return {
            portfolioId: Number(portfolioId),
            portfolioAnalysis: {
                totalAssets: portfolioCalculations.totalValue,
                dailyPL: portfolioCalculations.absoluteDailyPnl,
                dailyPLPercentage: portfolioCalculations.percentageDailyPnl,
                totalPL: portfolioCalculations.absolutePnl,
                totalPLPercentage: portfolioCalculations.percentagePnl,
                annualizedRoR: 100
            },
            triggeredAlerts: [],
            portfolioBreakdown: portfolioBreakdown,
            portfolioHoldings: [],
            orderExecutionProgress: []
        }
    }
}