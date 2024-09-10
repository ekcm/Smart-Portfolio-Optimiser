import { Module } from "@nestjs/common";
import { AssetPriceModule } from './assetprice.module';
import { AssetModule } from "./asset.module";
import { PortfolioCreationService } from "src/service/portfolioCreation.service";
import { PortfolioCreationController } from "src/controller/portfolioCreation.controller";

@Module({
    imports: [AssetPriceModule, AssetModule],
    providers: [PortfolioCreationService],
    exports: [PortfolioCreationService],
    controllers: [PortfolioCreationController]
})

export class PortfolioCreationModule { }