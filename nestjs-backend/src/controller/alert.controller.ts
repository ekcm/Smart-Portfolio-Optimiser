import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AlertService } from "../service/alert.service";
import { FinanceNewsService } from "src/service/financeNews.service";
import { AlertDto } from "src/dto/alert.dto";

@ApiTags("Alert Service")
@Controller("alert")
export class AlertController {
    constructor(private readonly alertService: AlertService) { }

    @Get()
    @ApiOperation({ summary: "Get alerts by Tickers and add Company Name" })
    @ApiQuery({
        name: "tickers",
        type: String,
        required: false,
        isArray: true,
        description: "Array of ticker symbols to fetch alerts for",
        example: ["AAPL", "DOW", "AMGN"],
    })
    async getAlerts(@Query("tickers") tickers: string[] = []): Promise<AlertDto[]> {
        const tickersArray = Array.isArray(tickers) ? tickers : [tickers];
        return await this.alertService.getAlerts(tickersArray);
    }
}