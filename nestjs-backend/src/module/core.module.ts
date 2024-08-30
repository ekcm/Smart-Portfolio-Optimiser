import { Module } from "@nestjs/common";
import { CoreService } from "src/service/core.service";
import { PortfolioModule } from "./portfolio.module";
import { PortfolioCalculatorModule } from "./portfolioCalculator.module";
import { CoreController } from "src/controller/core.controller";
import { PortfolioBreakdownModule } from "./portfolioBreakdown.module";

@Module({
    imports: [PortfolioCalculatorModule, PortfolioModule, PortfolioBreakdownModule],
    controllers: [CoreController],
    providers: [CoreService],
    exports: [CoreService],
})

export class CoreModule { }