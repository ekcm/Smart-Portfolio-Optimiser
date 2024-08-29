import { Module } from "@nestjs/common";
import { AssetPriceModule } from "./assetprice.module";
import { AssetModule } from "./asset.module";
import { PortfolioBreakdownService } from "src/service/portfolioBreakdown.service";

@Module({
    imports: [ AssetPriceModule, AssetModule ],
    providers: [PortfolioBreakdownService],
    exports: [PortfolioBreakdownService]
})
export class PortfolioBreakdownModule { }
