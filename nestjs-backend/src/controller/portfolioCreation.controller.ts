import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PortfolioCreationService } from '../service/portfolioCreation.service';
import { OrderDto } from "src/dto/order.dto";

@ApiTags("Portfolio Generation Service")
@Controller("generate")
export class PortfolioCreationController {
    constructor(private portfolioCreationService: PortfolioCreationService) { }
    
    @Get(':id/:cash')
    @ApiOperation({ summary: "Generate orders for an optimized portfolio"})
    @ApiQuery({
        name: 'exclusions',
        required: false,
        type: [String],
        description: 'Array of the tickers of excluded assets',
        example: ['AAPL']
    })
    async generateOrders(@Param('id') id: string, @Param('cash') cash: number, @Param('riskAppetite') riskAppetite: string, @Query('exclusions') exclusions: string[] = []): Promise<OrderDto[]>{
        const exclusionsArray = Array.isArray(exclusions) ? exclusions : [exclusions];
        return await this.portfolioCreationService.generateOrders(cash, riskAppetite, exclusionsArray, id);
    }
}