import { Injectable } from "@nestjs/common";
import { PortfolioService } from "src/service/portfolio.service";

@Injectable()
export class PortfolioCalculatorService {
    
    constructor(private PortfolioService: PortfolioService) { }


    async calculatePortfolioValue(portfolioId: string): Promise<void> {
        
        const portfolio = await this.PortfolioService.getById(portfolioId);
        console.log(portfolio)
    }
}