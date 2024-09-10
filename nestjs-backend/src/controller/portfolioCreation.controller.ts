import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PortfolioCreationService } from '../service/portfolioCreation.service';
import { OrderDto } from "src/dto/order.dto";

@ApiTags("Portfolio Generation Service")
@Controller("generate")
export class PortfolioCreationController {
    constructor(private portfolioCreationService: PortfolioCreationService) { }
    
    @Get(':id')
    @ApiOperation({ summary: "Generate orders for an optimized portfolio"})
    async generateOrders(@Param('id') id: string, @Param('cash') cash: number, @Param('riskAppetite') riskAppetite: string, @Query('exclusions') exclusions: string[]): Promise<OrderDto[]>{
        return await this.portfolioCreationService.generateOrders(cash, riskAppetite, exclusions, id);
    }
}