import { Module } from "@nestjs/common";
import { TransactionController } from "src/controller/transaction.controller";
import { OrderService } from "src/service/order.service";
import { PortfolioService } from "src/service/portfolio.service";
import { TransactionService } from "src/service/transaction.service";

@Module({
    imports: [PortfolioService, OrderService],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})

export class TransactionsModule { }