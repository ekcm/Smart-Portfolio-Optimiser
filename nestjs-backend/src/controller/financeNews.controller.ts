import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FinanceNews } from "../model/financeNews.model";
import { FinanceNewsService } from "../service/financeNews.service";

@ApiTags("Finance News Service")
@Controller("financeNews")
export class FinanceNewsController {
	constructor(private readonly financeNewsService: FinanceNewsService) { }

	@Get()
	@ApiOperation({ summary: "Get all Finance News" })
	@ApiResponse({
		status: 200,
		description: "Returns a list of all finance news",
		schema: {
			type: "array",
			items: {
				example: [
					{
						"_id": "66ef29f6d094c73406fa5ea2",
						"ticker": "AAPL",
						"date": "2024-09-22T04:17:58.562Z",
						"sentimentRating": 4,
						"summary": [],
						"references": []
					},
				]
			}
		}
	})
	async getAll(): Promise<FinanceNews[]> {
		return await this.financeNewsService.getAll();
	}

	@Get('/:ticker')
	@ApiOperation({ summary: "Get one Finance News by ticker" })
	@ApiResponse({
		status: 200,
		description: "Returns specific finance news by ticker",
		schema: {
			example: {
				"_id": "66ef29f6d094c73406fa5ea2",
				"ticker": "AAPL",
				"date": "2024-09-22T04:17:58.562Z",
				"sentimentRating": 4,
				"summary": [],
				"references": []
			},
		}
	})
	async getByTicker(@Param('ticker') ticker: string): Promise<FinanceNews> {
		return await this.financeNewsService.getByTicker(ticker);
	}

	@Get('/tickers/latest')
	@ApiOperation({ summary: "Get the latest news for all specified tickers" })
	@ApiQuery({
        name: "tickers",
        type: String,
        required: true,
        isArray: true,
        description: "Array of ticker symbols to fetch finance news for",
        example: ["AAPL", "DOW", "AMGN"],
    })
	@ApiResponse({
		status: 200,
		description: "Returns latest finance news of specific tickers",
		schema: {
			type: "array",
			items: {
				example: [
					{
						"_id": "66ef29f6d094c73406fa5ea2",
						"ticker": "AAPL",
						"date": "2024-09-22T04:17:58.562Z",
						"sentimentRating": 4,
						"summary": [],
						"references": []
					},
				]
			}
		}
	})
	async getLatestByTicker(@Query('tickers') tickers: string[] = []): Promise<FinanceNews[]> {
		const tickersArray = Array.isArray(tickers) ? tickers : [tickers];
		return await this.financeNewsService.getLatestByTickers(tickersArray);
	}

}