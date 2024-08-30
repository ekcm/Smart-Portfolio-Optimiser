import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CoreService, DashboardCard, PortfolioData } from "src/service/core.service";

@ApiTags("Core Service")
@Controller("core")
export class CoreController {
    constructor(private coreService: CoreService) { }

    @Get(":manager")
    @ApiOperation({ summary: "Get all Portfolios by Manager" })
    async loadHomepage(@Param('manager') manager: string): Promise<DashboardCard[]> {
      return await this.coreService.loadHomepage(manager);
    }

    @Get("portfolio/:portfolioId")
    @ApiOperation({ summary: "Load Portfolio data of a specified portfolio"})
    async loadPortfolio(@Param('portfolioId') portfolioId: string): Promise<PortfolioData> {
      return await this.coreService.loadPortfolio(portfolioId);
    }

}