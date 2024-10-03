import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AlertService } from "../service/alert.service";
import { FinanceNewsService } from "src/service/financeNews.service";
import { AlertDto } from "src/dto/alert.dto";

@ApiTags("Alert Service")
@Controller("alert")
export class AlertController {
    constructor(private readonly alertService: AlertService) { }

    @Get()
    @ApiOperation({ summary: "Get alerts by Tickers and add Company Name" })
    async getAlerts(@Query("tickers") tickers: string[]): Promise<AlertDto[]> {
        return await this.alertService.getAlerts(tickers);
    }
}