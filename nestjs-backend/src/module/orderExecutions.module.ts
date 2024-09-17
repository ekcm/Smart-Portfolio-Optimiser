import { Module } from "@nestjs/common";
import { OrderExecutionsService } from "src/service/orderExecutions.service";
import { OrderModule } from "./order.module"; 
import { AssetModule } from "./asset.module"; 
import { AssetPriceModule } from "./assetprice.module"; 

@Module({
    imports: [OrderModule, AssetModule, AssetPriceModule], 
    providers: [OrderExecutionsService],
    exports: [OrderExecutionsService], 
})
export class OrderExecutionsModule {}