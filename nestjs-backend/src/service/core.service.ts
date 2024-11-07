import { Injectable } from "@nestjs/common";
import { Portfolio } from "src/model/portfolio.model";
import { DashboardCard, FinanceNewsCard, GeneratedInsight, GeneratedSummary, NestedInsight, NestedSummary, NewsArticle, OrderExecutionProgress, PortfolioData } from 'src/types';
import { AlertService } from "./alert.service";
import { AssetService } from "./asset.service";
import { FinanceNewsService } from "./financeNews.service";
import { OrderExecutionsService } from './orderExecutions.service';
import { PortfolioService } from "./portfolio.service";
import { PortfolioBreakdownService } from './portfolioBreakdown.service';
import { PortfolioCalculatorService } from "./portfolioCalculator.service";
import { PortfolioHoldingsService } from './portfolioHoldings.service';
import { RuleValidatorService } from './ruleValidator.service';

@Injectable()
export class CoreService {
    constructor(private portfolioService: PortfolioService, private portfolioCalculatorService: PortfolioCalculatorService, private portfolioBreakdownService: PortfolioBreakdownService, private portfolioHoldingsService: PortfolioHoldingsService, private orderExecutionsService: OrderExecutionsService, private alertService: AlertService, private financeNewsService: FinanceNewsService, private assetService: AssetService, private ruleValidatorService: RuleValidatorService) { }


    async loadHomepage(managerId: string): Promise<DashboardCard[]> {
        const portfolios: Portfolio[] = await this.portfolioService.getByManager(managerId)
        const portfolioCards: DashboardCard[] = []

        for (const portfolio of portfolios) {
            const portfolioCalculations = await this.portfolioCalculatorService.calculatePortfolioValue(portfolio)
            const portfolioBreakdown = await this.portfolioBreakdownService.loadPortfolio(portfolio)
            const breachedRules = await this.ruleValidatorService.checkPortfolio(portfolio.rules, portfolio.cashAmount, portfolioCalculations, portfolioBreakdown)
            portfolioCards.push({
                portfolioId: portfolio._id.toString(),
                clientName: portfolio.client,
                portfolioName: portfolio.portfolioName,
                riskAppetite: portfolio.riskAppetite,
                totalValue: portfolioCalculations.totalValue,
                totalPL: portfolioCalculations.totalPL,
                dailyPL: portfolioCalculations.dailyPL,
                totalPLPercentage: portfolioCalculations.totalPLPercentage,
                dailyPLPercentage: portfolioCalculations.dailyPLPercentage,
                rateOfReturn: 100,
                alertsPresent: breachedRules.length > 0,
            });
        }
        return portfolioCards
    }

    async loadPortfolio(portfolioId: string): Promise<PortfolioData> {
        const portfolio = await this.portfolioService.getById(portfolioId)
        const portfolioBreakdown = await this.portfolioBreakdownService.loadPortfolio(portfolio)
        const portfolioCalculations = await this.portfolioCalculatorService.calculatePortfolioValue(portfolio)
        const portfolioHoldings = await this.portfolioHoldingsService.getPortfolioHoldings(portfolio, portfolioCalculations)
        const orderExecutions: OrderExecutionProgress[] = await this.orderExecutionsService.getOrderExecutions(portfolioId);
        const alerts = await this.alertService.getAlerts(portfolio.assetHoldings.map(holding => holding.ticker))
        const breachedRules = await this.ruleValidatorService.checkPortfolio(portfolio.rules, portfolio.cashAmount, portfolioCalculations, portfolioBreakdown)
        return {
            portfolioId: portfolioId,
            clientName: portfolio.client,
            portfolioName: portfolio.portfolioName,
            portfolioAnalysis: {
                totalAssets: portfolioCalculations.totalValue,
                dailyPL: portfolioCalculations.dailyPL,
                dailyPLPercentage: portfolioCalculations.dailyPLPercentage,
                totalPL: portfolioCalculations.totalPL,
                totalPLPercentage: portfolioCalculations.totalPLPercentage,
                annualizedRoR: 100
            },
            triggeredAlerts: alerts,
            breachedRules: breachedRules,
            portfolioBreakdown: portfolioBreakdown,
            portfolioHoldings: portfolioHoldings,
            orderExecutionProgress: orderExecutions
        }
    }

    async loadFinanceNewsCards(): Promise<FinanceNewsCard[]> {
        const newses = await this.financeNewsService.getAll()
        const assets = await this.assetService.getAll()
        const assetMap = new Map<string, string>();
        assets.forEach(asset => {
            assetMap.set(asset.ticker, asset.name);
        });
        const financeNewsCards: FinanceNewsCard[] = []
        for (const news of newses) {
            financeNewsCards.push({
                id: news._id.toString(),
                company: assetMap.get(news.ticker),
                ticker: news.ticker,
                date: news.date,
                sentimentRating: news.sentimentRating,
                introduction: news.summary[0].content as string,
            })
        }

        return financeNewsCards
    }

    async loadNewsArticle(newsId: string): Promise<NewsArticle> {
        const news = await this.financeNewsService.getById(newsId)
        const asset = await this.assetService.getByTicker(news.ticker)
        const generated: GeneratedSummary[] = news.summary

        const insights = []
        for (const analysis of generated) {
            const content: string | NestedSummary = analysis.content
            if (typeof content === 'object') {
                const nestedInsights: NestedInsight[] = []
                for (const key in content) {
                    if (typeof content[key] === 'string') {
                        const nestedInsight: NestedInsight = {
                            subtitle: key,
                            content: content[key]
                        }
                        nestedInsights.push(nestedInsight)
                    }
                }
                const insight: GeneratedInsight = {
                    title: analysis.title,
                    content: nestedInsights
                }
                if (nestedInsights.length > 0) {insights.push(insight)};
            }
            if (typeof content === 'string') {
                const insight: GeneratedInsight = {
                    title: analysis['title'],
                    content: content
                }
                insights.push(insight)
            }

        }

        
        return {
            id: newsId,
            company: asset.name,
            ticker: news.ticker,
            date: news.date,
            sentimentRating: news.sentimentRating,
            insights: insights,
            references: news.references
        }
    }
}