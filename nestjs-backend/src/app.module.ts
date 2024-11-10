import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetModule } from './module/asset.module';
import { OrderModule } from './module/order.module';
import { PortfolioModule } from './module/portfolio.module';
import { AssetPriceModule } from './module/assetprice.module';
import { PortfolioCalculatorModule } from './module/portfolioCalculator.module';
import { CoreModule } from './module/core.module';
import { UserModule } from './module/user.module';
import { TransactionsModule } from './module/transactions.module';
import { PortfolioCreationModule } from './module/portfolioCreation.module';
import { FinanceNewsModule } from './module/financeNews.module';
import { AlertModule } from './module/alert.module';
import { RuleLogModule } from './module/ruleLog.module'; 
import { RuleValidatorModule } from './module/ruleValidator.module';
import { AssetPriceTestModule } from './module/assetpricetest.module';
import { AssetPriceTestService } from './service/assetpricetest.service';
import { OrderFulfilmentModule } from './module/orderFulfilment.module';
import { SqsPollingService } from './service/sqsPolling.service';
import { SqsService } from './service/sqs.service';
import { PortfolioGateway } from './websocket/portfolio.gateway';
import { AssetPriceChangeService } from './service/assetpricechange.service';
// import { RuleModule } from './module/rule.module';
import { RuleHandlerModule } from './module/ruleHandler.module';
import { ReportModule } from './module/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
        retryWrites: false,
      }),
    }),
    OrderModule,
    PortfolioModule,
    AssetModule,
    AssetPriceModule,
    PortfolioCalculatorModule,
    CoreModule,
    UserModule,
    TransactionsModule,
    PortfolioCreationModule,
    FinanceNewsModule,
    AlertModule,
    RuleHandlerModule,
    RuleLogModule, 
    RuleValidatorModule,
    AssetPriceTestModule,
    OrderFulfilmentModule,
    ReportModule,
  ],
  providers: [SqsService, SqsPollingService, AssetPriceTestService, PortfolioGateway, AssetPriceChangeService,],
})
export class AppModule {
  constructor(private readonly assetPriceTestService: AssetPriceTestService) {}
}