import { Module } from "@nestjs/common";
import { PortfolioCalculatorService } from "src/service/portfolioCalculator.service";
import { AssetPriceModule } from './assetprice.module';

@Module({
    imports: [AssetPriceModule],
    providers: [PortfolioCalculatorService],
    exports: [PortfolioCalculatorService],
})

export class PortfolioCalculatorModule { }