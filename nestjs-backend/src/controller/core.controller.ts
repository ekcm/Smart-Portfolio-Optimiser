import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RuleLogDto } from "src/dto/ruleLog.dto";
import { CoreService } from "src/service/core.service";
import { BreachedRule, DashboardCard, FinanceNewsCard, NewsArticle, PortfolioData, RuleReport, ValidateIntermediatePortfolio } from "src/types"
import { ApiProperty } from '@nestjs/swagger';

export class ValidateIntermediatePortfolioClass {
  @ApiProperty({
    description: 'Intermediate asset holdings to be validated',
    type: Array,
    items: { type: 'object' },
  })
  intermediateAssetHoldings: any[]; // Replace with actual type

  @ApiProperty({
    description: 'Intermediate cash amount to be validated',
    type: Number,
  })
  intermediateCashAmount: number;
}
@ApiTags("Core Service")
@Controller("core")
export class CoreController {
    constructor(private readonly coreService: CoreService) { }

    @Get(":manager")
    @ApiOperation({ summary: "Get all Portfolios by Manager" })
    @ApiParam({
        name: "manager",
        description: "Manager ID",
        required: true,
        example: "66d9815bacb3da812c4e4c5b",
    })
    @ApiResponse({
		status: 200,
		description: "List of all portfolios under specific manager id",
		schema: { 
		type: "array",
		items: {
			example: [
                {
                    "portfolioId": "string",
                    "clientName": "string",
                    "portfolioName": "string",
                    "riskAppetite": "MEDIUM",
                    "totalValue": 0,
                    "totalPL": 0,
                    "dailyPL": 0,
                    "totalPLPercentage": 0,
                    "dailyPLPercentage": 0,
                    "rateOfReturn": 0,
                    "alertsPresent": true
                },
                ],
			},
		},
	})
    async loadHomepage(@Param('manager') manager: string): Promise<DashboardCard[]> {
        return await this.coreService.loadHomepage(manager);
    }

    @Get("portfolio/:portfolioId")
    @ApiOperation({ summary: "Load Portfolio data of a specified portfolio" })
    @ApiParam({
        name: "portfolioId",
        description: "portfolio Id of portfolio",
        required: true,
        example: "66d9ae695e15ad24b5e2053a",
    })
    @ApiResponse({
		status: 200,
		description: "Portfolio details by portfolio",
		schema: {
		example: {
            "portfolioId": "string",
            "clientName": "string",
            "portfolioName": "string",
            "portfolioAnalysis": {
                "totalAssets": 0,
                "cashAmount": 0,
                "securitiesValue": 0,
                "dailyPL": 0,
                "dailyPLPercentage": 0,
                "totalPL": 0,
                "totalPLPercentage": 0,
                "annualizedRoR": 0
            },
            "triggeredAlerts": [],
            "breachedRules": {
                "breachedRules": [],
                "recommendation": "",
                "news": {
                    "buy": []
                }
            },
            "portfolioBreakdown": {
                "securities": [],
                "industry": [],
                "geography": []
            },
            "portfolioHoldings": [],
            "orderExecutionProgress": []
            },
		},
	})
    async loadPortfolio(@Param('portfolioId') portfolioId: string): Promise<PortfolioData> {
        return await this.coreService.loadPortfolio(portfolioId);
    }

    @Get("news/all")
    @ApiOperation({ summary: "Get all Finance News" })
    @ApiResponse({
		status: 200,
		description: "All finance news",
		schema: {
		example: [
            {
                "id": "66ef29f6d094c73406fa5ea2",
                "company": "Apple",
                "ticker": "AAPL",
                "date": "2024-09-22T04:17:58.562Z",
                "sentimentRating": 4,
                "introduction": "As of September..."
            }
        ],
		},
	})
    async loadFinanceNews(): Promise<FinanceNewsCard[]> {
        return await this.coreService.loadFinanceNewsCards();
    }

    @Get("news/:id")
    @ApiOperation({ summary: "News by id for individaul article page" })
    @ApiResponse({
		status: 200,
		description: "Individual finance news by ticker id",
		schema: {
		example: {
                "id": "string",
                "company": "string",
                "ticker": "string",
                "date": "2024-09-22T04:17:58.562Z",
                "sentimentRating": 0,
                "introduction": "string"
            },
		},
	})
    async loadFinanceNewsById(@Param('id') id: string): Promise<NewsArticle> {
        return await this.coreService.loadNewsArticle(id);
    }

    @Get("ruleLogs/:portfolioId")
    @ApiOperation({ summary: "Get all Rule Logs by portfolioId" })
    @ApiParam({
        name: "portfolioId",
        description: "portfolio Id of portfolio",
        required: true,
        example: "66d9ae695e15ad24b5e2053a",
    })
    async loadRuleLogs(@Param('portfolioId') portfolioId: string): Promise<RuleLogDto[]> {
        return await this.coreService.loadRuleLogs(portfolioId);
    }

    @Post("portfolio/validate/:portfolioId")
    @ApiOperation({ summary: "Validate intermediate portfolio rules" })
    @ApiBody({
        description: 'Validate intermediate portfolio rules by providing asset holdings and cash amount',
        type: ValidateIntermediatePortfolioClass,
    })
    async validateIntermediatePortfolio(
        @Param('portfolioId') portfolioId: string,
        @Body() validateDto: ValidateIntermediatePortfolio
    ): Promise<RuleReport> {
        const { intermediateAssetHoldings, intermediateCashAmount } = validateDto;
        return await this.coreService.validateIntermediatePortfolioRules(portfolioId, intermediateAssetHoldings, intermediateCashAmount);
    }

}