import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PortfolioCreationService } from '../service/portfolioCreation.service';
import { ProposedPortfolio } from "src/types";
import { PortfolioDto } from "src/dto/portfolio.dto";

@ApiTags("Portfolio Generation Service")
@Controller("generate")
export class PortfolioCreationController {
    constructor(private portfolioCreationService: PortfolioCreationService) { }
    
    @Post("/proposal")
    @ApiOperation({ summary: "Generate orders for an optimized portfolio"})
    @ApiQuery({
        name: 'exclusions',
        required: false,
        type: [String],
        description: 'Array of the tickers of excluded assets',
        example: ['AAPL']
    })
    async generateOrders(@Body()portfolioDto: PortfolioDto, @Query('exclusions') exclusions: string[] = []): Promise<ProposedPortfolio>{
        const exclusionsArray = Array.isArray(exclusions) ? exclusions : [exclusions];
        return await this.portfolioCreationService.generateOrders(portfolioDto, exclusionsArray);
    }
}