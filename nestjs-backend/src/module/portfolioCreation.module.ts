import { Module } from "@nestjs/common";
import { AssetPriceModule } from './assetprice.module';
import { AssetModule } from "./asset.module";
import { PortfolioCreationService } from "src/service/portfolioCreation.service";

@Module({
    imports: [AssetPriceModule, AssetModule],
    providers: [PortfolioCreationService],
    exports: [PortfolioCreationService],
})

export class PortfolioCreationModule { }