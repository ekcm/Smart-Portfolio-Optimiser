import { Module } from '@nestjs/common';
import { ReportController } from 'src/controller/report.controller';
import { AssetService } from 'src/service/asset.service';
import { AssetPriceService } from 'src/service/assetprice.service';
import { PortfolioService } from 'src/service/portfolio.service';
import { PortfolioBreakdownService } from 'src/service/portfolioBreakdown.service';
import { ReportService } from 'src/service/report.service';

@Module({
    imports: [PortfolioService, PortfolioBreakdownService],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class RuleModule { }