import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FinanceNews } from "../model/financeNews.model";
import { FinanceNewsService } from "../service/financeNews.service";

@ApiTags("Finance News Service")
@Controller("financeNews")
export class FinanceNewsController {
	constructor(private readonly financeNewsService: FinanceNewsService) { }

	@Get()
	@ApiOperation({ summary: "Get all Assets" })
	async getAll(): Promise<FinanceNews[]> {
		return await this.financeNewsService.getAll();
	}

	@Get('/:ticker')
	@ApiOperation({ summary: "Get one Asset by ticker" })
	async getByTicker(@Param('ticker') ticker: string): Promise<FinanceNews> {
		return await this.financeNewsService.getByTicker(ticker);
	}

}