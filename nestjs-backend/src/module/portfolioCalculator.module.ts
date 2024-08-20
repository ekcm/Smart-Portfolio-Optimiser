import { Module } from "@nestjs/common";
import { PortfolioCalculatorController } from "src/controller/portfolioCalculator.controller";
import { PortfolioService } from "src/service/portfolio.service";
import { PortfolioCalculatorService } from "src/service/portfolioCalculator.service";

@Module({
    imports: [PortfolioService],
    controllers: [PortfolioCalculatorController],
    providers: [PortfolioCalculatorService],
    exports: [PortfolioCalculatorService],
})

export class PortfolioCalculatorModule { }