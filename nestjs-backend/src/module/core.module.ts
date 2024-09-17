import { Module } from "@nestjs/common";
import { CoreService } from "src/service/core.service";
import { PortfolioModule } from "./portfolio.module";
import { PortfolioCalculatorModule } from "./portfolioCalculator.module";
import { CoreController } from "src/controller/core.controller";
import { PortfolioBreakdownModule } from "./portfolioBreakdown.module";
import { PortfolioHoldingsModule } from "./portfolioHoldings.module";
import { OrderExecutionsModule } from "./orderexecutions.module";

@Module({
    imports: [PortfolioCalculatorModule, PortfolioModule, PortfolioBreakdownModule, PortfolioHoldingsModule, OrderExecutionsModule],
    controllers: [CoreController],
    providers: [CoreService],
    exports: [CoreService],
})

export class CoreModule { }