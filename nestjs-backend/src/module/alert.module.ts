import { Module } from "@nestjs/common";
import { AlertService } from "src/service/alert.service";
import { FinanceNewsModule } from "./financeNews.module";

@Module({
    imports: [FinanceNewsModule],
    providers: [AlertService],
    exports: [AlertService]
})

export class AlertModule { }