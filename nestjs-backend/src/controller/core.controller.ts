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
                    "portfolioId": "66d9ae695e15ad24b5e2053a",
                    "clientName": "Tom",
                    "portfolioName": "Portfolio1",
                    "riskAppetite": "MEDIUM",
                    "totalValue": 15366.77,
                    "totalPL": 1921.6,
                    "dailyPL": -11.63,
                    "totalPLPercentage": 14.36,
                    "dailyPLPercentage": -0.08,
                    "rateOfReturn": 100,
                    "alertsPresent": true
                },
                {
                    "portfolioId": "673edcfaa141dc2133e204e6",
                    "clientName": "IS484",
                    "portfolioName": "Final Presentation",
                    "riskAppetite": "MEDIUM",
                    "totalValue": 119342.5,
                    "totalPL": -657.5,
                    "dailyPL": -102.19,
                    "totalPLPercentage": -0.69,
                    "dailyPLPercentage": -0.11,
                    "rateOfReturn": 100,
                    "alertsPresent": true
                }
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
            "portfolioId": "673edcfaa141dc2133e204e6",
            "clientName": "IS484",
            "portfolioName": "Final Presentation",
            "portfolioAnalysis": {
                "totalAssets": 119342.5,
                "cashAmount": 24500.000000000022,
                "securitiesValue": 94841.48474999999,
                "dailyPL": -102.19,
                "dailyPLPercentage": -0.11,
                "totalPL": -657.5,
                "totalPLPercentage": -0.69,
                "annualizedRoR": 100
            },
            "triggeredAlerts": [
                {
                "id": "673dc25e23fe016af3c6fba5",
                "ticker": "CAT",
                "date": "2024-11-20T19:05:02.920Z",
                "sentimentRating": 4,
                "introduction": "Caterpillar...",
                "assetName": "Caterpillar"
                },
            ],
            "breachedRules": {
                "breachedRules": [],
                "recommendation": "",
                "news": {
                    "buy": []
                }
            },
            "portfolioBreakdown": {
                "securities": [
                    {
                        "STOCK": 39.68
                    },
                    {
                        "BOND": 39.79
                    },
                    {
                        "CASH": 20.53
                    }
                ],
                "industry": [
                    {
                        "Construction and mining": 3.58
                    },
                ],
                "geography": [
                    {
                        "USA": 100
                    }
                ]
            },
            "portfolioHoldings": [
                {
                    "name": "Caterpillar",
                    "ticker": "CAT",
                    "type": "STOCK",
                    "geography": "USA",
                    "position": 9.021920934257132,
                    "market": 3394.046765598404,
                    "last": 376.20001220703125,
                    "cost": 387.510009765625,
                    "totalPL": -102.037903740274,
                    "totalPLPercentage": -2.92,
                    "dailyPL": -27.426441404574277,
                    "dailyPLPercentage": -0.8,
                    "positionsRatio": 3.58
                },
            ],
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
                "id": "66ef29f6d094c73406fa5ea2",
                "company": "Apple",
                "ticker": "AAPL",
                "date": "2024-09-22T04:17:58.562Z",
                "sentimentRating": 4,
                "introduction": "As of September..."
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
        type: ValidateIntermediatePortfolioClass,  // Specify the DTO class to document the request body
    })
    async validateIntermediatePortfolio(
        @Param('portfolioId') portfolioId: string,
        @Body() validateDto: ValidateIntermediatePortfolio
    ): Promise<RuleReport> {
        const { intermediateAssetHoldings, intermediateCashAmount } = validateDto;
        return await this.coreService.validateIntermediatePortfolioRules(portfolioId, intermediateAssetHoldings, intermediateCashAmount);
    }

}