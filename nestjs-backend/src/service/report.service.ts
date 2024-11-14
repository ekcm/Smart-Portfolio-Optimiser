import { Injectable } from "@nestjs/common"
import { PortfolioService } from "./portfolio.service"
import { PortfolioBreakdownService } from "./portfolioBreakdown.service"
import { PortfolioReport, AssetHoldingReport } from "src/types"
import { AssetHolding } from "src/model/assetholding.model";
import { Order } from "src/model/order.model";
import { OrderService } from "./order.service";
import { AssetPriceService } from "./assetprice.service";
import { AssetPrice } from "src/model/assetprice.model";

@Injectable()
export class ReportService{
    constructor(private portfolioService: PortfolioService, private portfolioBreakdownService: PortfolioBreakdownService, private orderService: OrderService, private assetPriceService: AssetPriceService) { }

    async generateReport(portfolioId: string): Promise<PortfolioReport> {
        var assetsAllocation = new Map<string, AssetHoldingReport>();
        var topHoldings = new Map<string, number>();
        var sectorAllocation = new Map<string, number>();
        var geographyAllocation = new Map<string, number>();
        var assetPriceMap = new Map<string, AssetPrice>();
        const portfolio = await this.portfolioService.getById(portfolioId);
        const breakdown = await this.portfolioBreakdownService.loadPortfolio(portfolio);
        const tickers = portfolio.assetHoldings.map(assetHolding => assetHolding.ticker)
        const assetPrices = await this.assetPriceService.getLatestFrom(tickers)
        assetPrices.forEach(assetPrice => {
            assetPriceMap.set(assetPrice.ticker, assetPrice)
        });
        const industryArray = breakdown.industry
        const geographyArray = breakdown.geography
        const securitiesArray = breakdown.securities.flatMap(obj =>
            Object.entries(obj).filter(([key, value]) => value !== undefined) as [string, number][]
        );
        const assetHoldingArray = portfolio.assetHoldings
        var totalValue = 0
        assetHoldingArray.forEach(assetHolding => {
            totalValue += assetHolding.quantity * assetPriceMap.get(assetHolding.ticker).todayClose    
        });
        const sortedSecurities = assetHoldingArray.sort((a,  b) => b.quantity * assetPriceMap.get(b.ticker).todayClose - a.quantity * assetPriceMap.get(a.ticker).todayClose);
        const top3Securities = sortedSecurities.slice(0, Math.min(3, sortedSecurities.length))
        industryArray.forEach(obj => {
            for (const key in obj) {
                const value = obj[key];
                if (value !== undefined) {
                    sectorAllocation.set(key, value);
                }
            }
        })
        
        geographyArray.forEach(obj => {
            for (const key in obj) {
                const value = obj[key];
                if (value !== undefined) {
                    geographyAllocation.set(key, value);
                }
            }
        })

        assetHoldingArray.forEach(assetHolding => {
            const ticker = assetHolding.ticker
            var tempAssetHoldingReport = {
                ticker: assetHolding.ticker,
                cost: assetHolding.cost,
                quantity: assetHolding.quantity,
                assetType: assetHolding.assetType,
                last: assetPriceMap.get(ticker).todayClose,
                positionRatio: assetPriceMap.get(ticker).todayClose * assetHolding.quantity / totalValue
            }
            assetsAllocation.set(assetHolding.ticker, tempAssetHoldingReport)
        })
        var total = 1
        top3Securities.forEach(security => {
            topHoldings.set(security.ticker, assetsAllocation.get(security.ticker).positionRatio)
            total -= assetsAllocation.get(security.ticker).positionRatio 
        })

        topHoldings.set("others", total)

        const portfolioSummary = {
            assetsAllocation: Object.fromEntries(assetsAllocation),
            topHoldings: Object.fromEntries(topHoldings),
            overview: "placeholder",
            sectorAllocation: Object.fromEntries(sectorAllocation),
            commentary: "placeholder",
        }

        const portfolioDetails = {
            portfolioName: portfolio.portfolioName,
            portfolioClient: portfolio.client
        }

        const report = {
            portfolioSummary: portfolioSummary,
            portfolioDetails: portfolioDetails
        }
        return report
    }

    async generateOrderExecution(portfolioId: string, startDate: Date, endDate: Date): Promise<Order[]> {
        return await this.orderService.getByIdAndDateRange(portfolioId, startDate, endDate)
    }
}