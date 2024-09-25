import { Module } from "@nestjs/common";
import { CoreService } from "src/service/core.service";
import { PortfolioModule } from "./portfolio.module";
import { PortfolioCalculatorModule } from "./portfolioCalculator.module";
import { CoreController } from "src/controller/core.controller";
import { PortfolioBreakdownModule } from "./portfolioBreakdown.module";
import { PortfolioHoldingsModule } from "./portfolioHoldings.module";
import { OrderExecutionsModule } from "./orderExecutions.module";
import { AlertModule } from "./alert.module";
import { FinanceNewsModule } from "./financeNews.module";
import { AssetModule } from "./asset.module";

@Module({
    imports: [PortfolioCalculatorModule, PortfolioModule, PortfolioBreakdownModule, PortfolioHoldingsModule, OrderExecutionsModule, AlertModule, FinanceNewsModule, AssetModule],
    controllers: [CoreController],
    providers: [CoreService],
    exports: [CoreService],
})

export class CoreModule { }