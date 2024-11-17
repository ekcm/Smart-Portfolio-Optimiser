import { Module } from '@nestjs/common';
import { ReportController } from 'src/controller/report.controller';
import { ReportService } from 'src/service/report.service';
import { PortfolioModule } from './portfolio.module';
import { PortfolioBreakdownModule } from './portfolioBreakdown.module';
import { OrderModule } from './order.module';
import { AssetPriceModule } from './assetprice.module';

@Module({
    imports: [PortfolioModule, PortfolioBreakdownModule, OrderModule, AssetPriceModule],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class ReportModule { }