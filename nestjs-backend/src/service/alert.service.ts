import { Injectable } from "@nestjs/common";
import { AlertDto } from "src/dto/alert.dto";
import { GeneratedInsight, GeneratedSummary, NestedSummary } from 'src/types';
import { FinanceNewsService } from "./financeNews.service";

@Injectable()
export class AlertService {
    constructor(private financeNewsService: FinanceNewsService) { }

    private ASSETNAMES_MAP = new Map<string, string>([
        ["AAPL", "Apple"],
        ["AMGN", "Amgen"],
        ["AXP", "American Express"],
        ["BA", "Boeing"],
        ["CAT", "Caterpillar"],
        ["CRM", "Salesforce"],
        ["CSCO", "Cisco"],
        ["CVX", "Chevron"],
        ["DIS", "Disney"],
        ["DOW", "Dow"],
        ["GS", "Goldman Sachs"],
        ["HD", "Home Depot"],
        ["HON", "Honeywell"],
        ["IBM", "IBM"],
        ["INTC", "Intel"],
        ["JNJ", "Johnson & Johnson"],
        ["JPM", "JPMorgan Chase"],
        ["KO", "Coca-Cola"],
        ["MCD", "Mcdonalds"],
        ["MMM", "3M"],
        ["MRK", "Merck"],
        ["MSFT", "Microsoft"],
        ["NKE", "Nike"],
        ["PG", "Procter & Gamble"],
        ["TRV", "Travelers"],
        ["UNH", "UnitedHealth Group"],
        ["V", "Visa"],
        ["VZ", "Verizon"],
        ["WBA", "Walgreens Boots Alliance"],
        ["WMT", "Walmart"]
    ])

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
                assetName: this.ASSETNAMES_MAP.get(news.ticker)
            })
        }

        return alerts
    }
}