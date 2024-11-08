import { Injectable } from "@nestjs/common"
import { PortfolioService } from "./portfolio.service"
import { PortfolioBreakdownService } from "./portfolioBreakdown.service"
import { PortfolioReport } from "src/types"
import { AssetHolding } from "src/model/assetholding.model";

@Injectable()
export class ReportService{
    constructor(private portfolioService: PortfolioService, private portfolioBreakdownService: PortfolioBreakdownService) { }

    async generateReport(portfolioId: string): Promise<PortfolioReport> {
        var assetsAllocation = new Map<string, AssetHolding>();
        var topHoldings = new Map<string, number>();
        var sectorAllocation = new Map<string, number>();
        var geographyAllocation = new Map<string, number>();
        const portfolio = await this.portfolioService.getById(portfolioId);
        const breakdown = await this.portfolioBreakdownService.loadPortfolio(portfolio);
        const industryArray = breakdown.industry
        const geographyArray = breakdown.geography
        const securitiesArray = breakdown.securities.flatMap(obj =>
            Object.entries(obj).filter(([key, value]) => value !== undefined) as [string, number][]
        );
        const assetHoldingArray = portfolio.assetHoldings
        const sortedSecurities = securitiesArray.sort(([, a], [, b]) => b - a);
        const top3Securities = sortedSecurities.slice(0, Math.max(3, sortedSecurities.length))
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
            assetsAllocation.set(assetHolding.ticker, assetHolding)
        })

        top3Securities.forEach(security => {
            topHoldings.set(security[0], security[1])
        })

        const portfolioSummary = {
            assetsAllocation: assetsAllocation,
            topHoldings: topHoldings,
            overview: "placeholder",
            sectorAllocation: sectorAllocation,
            commentary: "palceholder"
        }

        const portfolioDetails = {
            portfolioName: portfolio.portfolioName,
            portfolioClient: portfolio.client
        }

        return {
            portfolioDetails: portfolioDetails,
            portfolioSummary: portfolioSummary
        }
    }
}