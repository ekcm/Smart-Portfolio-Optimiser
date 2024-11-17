import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RuleLogDto } from "src/dto/ruleLog.dto";
import { CoreService } from "src/service/core.service";
import { BreachedRule, DashboardCard, FinanceNewsCard, NewsArticle, PortfolioData, RuleReport, ValidateIntermediatePortfolio } from "src/types"

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

    @Get("ruleLogs/:portfolioId")
    @ApiOperation({ summary: "Get all Rule Logs by portfolioId" })
    async loadRuleLogs(@Param('portfolioId') portfolioId: string): Promise<RuleLogDto[]> {
        return await this.coreService.loadRuleLogs(portfolioId);
    }

    @Post("portfolio/validate/:portfolioId")
    @ApiOperation({ summary: "Validate intermediate portfolio rules" })
    async validateIntermediatePortfolio(
        @Param('portfolioId') portfolioId: string,
        @Body() validateDto: ValidateIntermediatePortfolio
    ): Promise<RuleReport> {
        const { intermediateAssetHoldings, intermediateCashAmount } = validateDto;
        return await this.coreService.validateIntermediatePortfolioRules(portfolioId, intermediateAssetHoldings, intermediateCashAmount);
    }

}