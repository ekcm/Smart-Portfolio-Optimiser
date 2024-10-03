import { Module } from "@nestjs/common";
import { AlertService } from "src/service/alert.service";
import { FinanceNewsModule } from "./financeNews.module";
import { AlertController } from "src/controller/alert.controller";

@Module({
    controllers: [AlertController],
    imports: [FinanceNewsModule],
    providers: [AlertService],
    exports: [AlertService]
})

export class AlertModule { }