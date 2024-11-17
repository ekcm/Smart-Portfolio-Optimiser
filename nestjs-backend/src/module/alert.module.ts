import { Module } from "@nestjs/common";
import { AlertService } from "src/service/alert.service";
import { FinanceNewsModule } from "./financeNews.module";
import { AlertController } from "src/controller/alert.controller";
import { AssetModule } from "./asset.module";

@Module({
    controllers: [AlertController],
    imports: [FinanceNewsModule, AssetModule],
    providers: [AlertService],
    exports: [AlertService]
})

export class AlertModule { }