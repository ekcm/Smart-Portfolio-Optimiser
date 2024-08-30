import { Module } from "@nestjs/common";
import { TransactionController } from "src/controller/transaction.controller";
import { TransactionService } from "src/service/transaction.service";
import { AssetModule } from "./asset.module";
import { AssetPriceModule } from "./assetprice.module";
import { OrderModule } from "./order.module";
import { PortfolioModule } from "./portfolio.module";

@Module({
    imports: [PortfolioModule, OrderModule, AssetModule, AssetPriceModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})

export class TransactionsModule { }