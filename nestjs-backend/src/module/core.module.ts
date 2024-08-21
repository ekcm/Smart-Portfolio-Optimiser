import { Module } from "@nestjs/common";
import { CoreService } from "src/service/core.service";
import { PortfolioService } from "src/service/portfolio.service";
import { PortfolioCalculatorService } from "src/service/portfolioCalculator.service";

@Module({
    imports: [PortfolioCalculatorService, PortfolioService],
    controllers: [],
    providers: [CoreService],
    exports: [CoreService],
})

export class CoreModule { }