import { Module } from '@nestjs/common';
import { ReportController } from 'src/controller/report.controller';
import { AssetService } from 'src/service/asset.service';
import { AssetPriceService } from 'src/service/assetprice.service';
import { ReportService } from 'src/service/report.service';
import { PortfolioModule } from './portfolio.module';
import { PortfolioBreakdownModule } from './portfolioBreakdown.module';

@Module({
    imports: [PortfolioModule, PortfolioBreakdownModule],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class ReportModule { }