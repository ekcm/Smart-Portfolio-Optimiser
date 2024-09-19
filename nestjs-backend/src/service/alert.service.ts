import { Injectable } from "@nestjs/common";
import { FinanceNewsService } from "./financeNews.service";
import { AlertDto } from "src/dto/alert.dto";
import { GeneratedInsight } from 'src/types';

@Injectable()
export class AlertService {
    constructor(private financeNewsService: FinanceNewsService) { }

    async getAlerts(tickers: string[]): Promise<AlertDto[]> {

        const alerts: AlertDto[] = []
        
        const newses = await this.financeNewsService.getLatestByTickers(tickers);

        for (const news of newses) {
            const generated: string = news.financeNews["Introduction"]
            const insights = []

            // Edit this once financeNews object is updated
            const insight: GeneratedInsight = {
                title: "Introduction", //hardcoded, replace with key from financeNews object
                description: generated
            }
            insights.push(insight)
            alerts.push({
                ticker: news.stock,
                date: news.date,
                sentimentRating: news.sentimentRating,
                insights: insights,
                references: news.financeNews["References"]
            })
        }

        return alerts
    }
}