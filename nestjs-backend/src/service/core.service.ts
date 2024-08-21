import { Injectable } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { PortfolioCalculatorService } from "./portfolioCalculator.service";
import { Portfolio } from "src/model/portfolio.model";

@Injectable()
export class CoreService {
    constructor(private portfolioService: PortfolioService, private portfolioCalculatorService: PortfolioCalculatorService) { }


    async loadHomepage(managerId : string): Promise<Object[]> {
        const portfolios: Portfolio[] = await this.portfolioService.getByManager(managerId)


        for (const portfolio of portfolios) {
            
            const portfolioCalculations = await this.portfolioCalculatorService.calculatePortfolioValue(portfolio)
        
            var clientName: string = portfolio.client
            var portfolioName: string = portfolio.portfolioName
            var riskAppetite: string = portfolio.riskAppetite
            var totalValue: number =  portfolio.cashAmount //+ portfolioCalculations.valueToday 
            var absolutePnl: number = portfolioCalculations.absolutePnl
            
            const portfolioValue = this.portfolioCalculatorService.calculatePortfolioValue(portfolio)
        };
        

        return [{ }]
    }

}