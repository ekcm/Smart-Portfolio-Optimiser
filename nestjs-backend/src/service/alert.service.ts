import { Injectable } from "@nestjs/common";
import { AlertDto } from "src/dto/alert.dto";
import { GeneratedInsight, GeneratedSummary, NestedSummary } from 'src/types';
import { FinanceNewsService } from "./financeNews.service";

@Injectable()
export class AlertService {
    constructor(private financeNewsService: FinanceNewsService) { }

    async getAlerts(tickers: string[]): Promise<AlertDto[]> {
        return []
    }
}