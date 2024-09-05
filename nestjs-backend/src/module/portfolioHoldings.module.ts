import { Module } from "@nestjs/common";

import { PortfolioHoldingsService } from "src/service/portfolioHoldings.service";
import { AssetModule } from "./asset.module";
import { AssetPriceModule } from "./assetprice.module";

@Module({
    imports: [AssetModule, AssetPriceModule],
    providers: [PortfolioHoldingsService],
    exports: [PortfolioHoldingsService],
})

export class PortfolioHoldingsModule { }   