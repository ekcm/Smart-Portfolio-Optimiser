import { Injectable } from "@nestjs/common";
import { Portfolio } from "src/model/portfolio.model";
import { DashboardCard, OrderExecutionProgress, PortfolioData } from "src/types";
import { DashboardCard, OrderExecutionProgress, PortfolioData } from "src/types";
import { PortfolioService } from "./portfolio.service";
import { PortfolioBreakdownService } from './portfolioBreakdown.service';
import { PortfolioCalculatorService } from "./portfolioCalculator.service";
import { PortfolioHoldingsService } from './portfolioHoldings.service';
import { OrderExecutionsService } from './orderExecutions.service';
import { OrderExecutionsService } from './orderExecutions.service';

@Injectable()
export class CoreService {
    constructor(private portfolioService: PortfolioService, private portfolioCalculatorService: PortfolioCalculatorService, private portfolioBreakdownService: PortfolioBreakdownService, private portfolioHoldingsService: PortfolioHoldingsService, private orderExecutionsService: OrderExecutionsService) { }
    constructor(private portfolioService: PortfolioService, private portfolioCalculatorService: PortfolioCalculatorService, private portfolioBreakdownService: PortfolioBreakdownService, private portfolioHoldingsService: PortfolioHoldingsService, private orderExecutionsService: OrderExecutionsService) { }


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
                totalPL: portfolioCalculations.totalPL,
                dailyPL: portfolioCalculations.dailyPL,
                totalPLPercentage: portfolioCalculations.totalPLPercentage,
                dailyPLPercentage: portfolioCalculations.dailyPLPercentage,
                rateOfReturn: 100,
                alertsPresent: true,
            });
        }
        return portfolioCards
    }

    async loadPortfolio(portfolioId: string): Promise<PortfolioData> {
        const portfolio = await this.portfolioService.getById(portfolioId)
        const portfolioBreakdown = await this.portfolioBreakdownService.loadPortfolio(portfolio)
        const portfolioCalculations = await this.portfolioCalculatorService.calculatePortfolioValue(portfolio)
        const portfolioHoldings = await this.portfolioHoldingsService.getPortfolioHoldings(portfolio, portfolioCalculations)
        const orderExecutions: OrderExecutionProgress[] = await this.orderExecutionsService.getOrderExecutions(portfolioId); 
        
        return {
            portfolioId: portfolioId,
            clientName: portfolio.client,
            portfolioName: portfolio.portfolioName,
            portfolioAnalysis: {
                totalAssets: portfolioCalculations.totalValue,
                dailyPL: portfolioCalculations.dailyPL,
                dailyPLPercentage: portfolioCalculations.dailyPLPercentage,
                totalPL: portfolioCalculations.totalPL,
                totalPLPercentage: portfolioCalculations.totalPLPercentage,
                annualizedRoR: 100
            },
            triggeredAlerts: [],
            portfolioBreakdown: portfolioBreakdown,
            portfolioHoldings: portfolioHoldings,
            orderExecutionProgress: orderExecutions
        }
    }
}