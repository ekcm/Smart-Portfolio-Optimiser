import { Injectable } from "@nestjs/common";
import { AlertDto } from "src/dto/alert.dto";
import { GeneratedInsight, GeneratedSummary, NestedSummary } from 'src/types';
import { FinanceNewsService } from "./financeNews.service";
import { AssetHolding } from "src/model/assetholding.model";

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

    async getBuyRecommendation(exclusions: string[], assetHoldings: AssetHolding[]): Promise<AlertDto[]> {
        const recommendations: AlertDto[] = []
        const tickers = Array.from(this.ASSETNAMES_MAP.keys());
        const exclusionsSet = new Set(exclusions)
        const holdingsSet = new Set(assetHoldings.map(holding => holding.ticker));

        const tickerList = tickers.filter(ticker => 
            !exclusionsSet.has(ticker) && !holdingsSet.has(ticker)
        );
        const newses = await this.financeNewsService.getLatestByTickersSentiment(tickerList, 5)
        const usedIndices = new Set<number>();
        for (let i=0; i < Math.min(3,newses.length); i++) {
            let randInt;
            do {
                randInt = Math.floor(Math.random() * newses.length);
            } while (usedIndices.has(randInt));
            
            usedIndices.add(randInt);
            const news = newses[randInt];
            recommendations.push({
                id: news._id.toString(),
                ticker: news.ticker,
                date: news.date,
                sentimentRating: news.sentimentRating,
                introduction: (news.summary[0].title.toLowerCase() === "introduction") ? news.summary[0].content as string : "No intro text",
                assetName: this.ASSETNAMES_MAP.get(news.ticker)
            })
        }

        return recommendations
    }

    async getSellRecommendation(assetHoldings: AssetHolding[]): Promise<AlertDto[]> {
        const recommendations: AlertDto[] = []
        const holdings = assetHoldings.map(holding => holding.ticker);
        const newses = await this.financeNewsService.getLatestByTickersSentiment(holdings, 1)
        const usedIndices = new Set<number>();
        for (let i=0; i < Math.min(3,newses.length); i++) {
            let randInt;
            do {
                randInt = Math.floor(Math.random() * newses.length);
            } while (usedIndices.has(randInt));
            
            usedIndices.add(randInt);
            const news = newses[randInt];
            recommendations.push({
                id: news._id.toString(),
                ticker: news.ticker,
                date: news.date,
                sentimentRating: news.sentimentRating,
                introduction: (news.summary[0].title.toLowerCase() === "introduction") ? news.summary[0].content as string : "No intro text",
                assetName: this.ASSETNAMES_MAP.get(news.ticker)
            })
        }
        
        return recommendations
    }

}