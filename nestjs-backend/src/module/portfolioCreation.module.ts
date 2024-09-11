import { Module } from "@nestjs/common";
import { AssetPriceModule } from './assetprice.module';
import { AssetModule } from "./asset.module";
import { PortfolioCreationService } from "src/service/portfolioCreation.service";
import { PortfolioCreationController } from "src/controller/portfolioCreation.controller";
import { PortfolioModule } from "./portfolio.module";

@Module({
    imports: [AssetPriceModule, AssetModule, PortfolioModule],
    providers: [PortfolioCreationService],
    exports: [PortfolioCreationService],
    controllers: [PortfolioCreationController]
})

export class PortfolioCreationModule { }