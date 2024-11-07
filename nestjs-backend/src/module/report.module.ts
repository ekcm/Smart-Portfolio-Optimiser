import { Module } from '@nestjs/common';
import { ReportController } from 'src/controller/report.controller';
import { AssetService } from 'src/service/asset.service';
import { AssetPriceService } from 'src/service/assetprice.service';
import { PortfolioService } from 'src/service/portfolio.service';
import { PortfolioBreakdownService } from 'src/service/portfolioBreakdown.service';

@Module({
    imports: [AssetPriceService, AssetService, PortfolioService],
    controllers: [ReportController],
    providers: [PortfolioBreakdownService],
    exports: [PortfolioBreakdownService]
})
export class RuleModule { }