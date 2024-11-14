import { Injectable } from "@nestjs/common";
import { AlertDto } from "src/dto/alert.dto";
import { FinanceNewsService } from "./financeNews.service";
import { AssetHolding } from "src/model/assetholding.model";
import { AssetService } from "./asset.service";

@Injectable()
export class AlertService {
    constructor(private financeNewsService: FinanceNewsService, private assetService: AssetService) { }

    async getAlerts(tickers: string[]): Promise<AlertDto[]> {
        const assetNames = await this.assetService.getAll()
        const assetNamesMap = new Map(
            assetNames.map(asset => [asset.ticker, asset.name])
        )
        const alerts: AlertDto[] = []
        const newses = await this.financeNewsService.getLatestByTickers(tickers)
        for (const news of newses) {
            alerts.push({
                id: news._id.toString(),
                ticker: news.ticker,
                date: news.date,
                sentimentRating: news.sentimentRating,
                introduction: (news.summary[0].title.toLowerCase() === "introduction") ? news.summary[0].content as string : "No intro text",
                assetName: assetNamesMap.get(news.ticker)
            })
        }

        return alerts
    }

    async getBuyRecommendation(exclusions: string[], assetHoldings: AssetHolding[]): Promise<AlertDto[]> {
        const assetNames = await this.assetService.getAll()
        const assetNamesMap = new Map(
            assetNames.map(asset => [asset.ticker, asset.name])
        )
        const recommendations: AlertDto[] = []
        const tickers = assetNames.map(asset => asset.ticker);
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
                assetName: assetNamesMap.get(news.ticker)
            })
        }

        return recommendations
    }

    async getSellRecommendation(assetHoldings: AssetHolding[]): Promise<AlertDto[]> {
        const assetNames = await this.assetService.getAll()
        const assetNamesMap = new Map(
            assetNames.map(asset => [asset.ticker, asset.name])
        )
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
                assetName: assetNamesMap.get(news.ticker)
            })
        }
        
        return recommendations
    }

}