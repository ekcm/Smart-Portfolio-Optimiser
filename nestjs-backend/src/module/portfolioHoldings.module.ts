import { Module } from "@nestjs/common";

import { PortfolioHoldingsService } from "src/service/portfolioHoldings.service";
import { AssetModule } from "./asset.module";
import { AssetPriceModule } from "./assetprice.module";
import { AssetCalculatorModule } from "./assetCalculator.module";

@Module({
    imports: [AssetModule, AssetPriceModule, AssetCalculatorModule],
    providers: [PortfolioHoldingsService],
    exports: [PortfolioHoldingsService],
})

export class PortfolioHoldingsModule { }   