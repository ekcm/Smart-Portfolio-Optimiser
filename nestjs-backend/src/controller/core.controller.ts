import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CoreService } from "src/service/core.service";
import { DashboardCard, FinanceNewsCard, NewsArticle, PortfolioData } from "src/types"

@ApiTags("Core Service")
@Controller("core")
export class CoreController {
    constructor(private readonly coreService: CoreService) { }

    @Get(":manager")
    @ApiOperation({ summary: "Get all Portfolios by Manager" })
    async loadHomepage(@Param('manager') manager: string): Promise<DashboardCard[]> {
        return await this.coreService.loadHomepage(manager);
    }

    @Get("portfolio/:portfolioId")
    @ApiOperation({ summary: "Load Portfolio data of a specified portfolio" })
    async loadPortfolio(@Param('portfolioId') portfolioId: string): Promise<PortfolioData> {
        return await this.coreService.loadPortfolio(portfolioId);
    }

    @Get("news/all")
    @ApiOperation({ summary: "Get all Finance News" })
    async loadFinanceNews(): Promise<FinanceNewsCard[]> {
        return await this.coreService.loadFinanceNewsCards();
    }

    @Get("news/:id")
    @ApiOperation({ summary: "News by id for individaul article page" })
    async loadFinanceNewsById(@Param('id') id: string): Promise<NewsArticle> {
        return await this.coreService.loadNewsArticle(id);
    }

}