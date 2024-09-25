import { Injectable } from "@nestjs/common";
import { AlertDto } from "src/dto/alert.dto";
import { GeneratedInsight, GeneratedSummary, NestedSummary } from 'src/types';
import { FinanceNewsService } from "./financeNews.service";

@Injectable()
export class AlertService {
    constructor(private financeNewsService: FinanceNewsService) { }

    async getAlerts(tickers: string[]): Promise<AlertDto[]> {
        const alerts: AlertDto[] = []
        const newses = await this.financeNewsService.getLatestByTickers(tickers)
        for (const news of newses) {
            alerts.push({
                id: news._id.toString(),
                ticker: news.ticker,
                date: news.date,
                sentimentRating: news.sentimentRating,
                introduction: (news.summary[0].title.toLowerCase() === "introduction") ? news.summary[0].content as string : "No intro text",
            })
        }

        return alerts
    }
}