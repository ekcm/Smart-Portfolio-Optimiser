import { Module, OnModuleInit } from '@nestjs/common';
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
import { RuleModule } from './module/rule.module'; 
import { RuleValidatorModule } from './module/ruleValidator.module';
import { AssetPriceTestModule } from './module/assetpricetest.module';
import { AssetPriceTestService } from './service/assetpricetest.service';
import { OrderFulfilmentModule } from './module/orderFulfilment.module';
import { SqsPollingService } from './service/sqsPolling.service';
import { SqsService } from './service/sqs.service';
import { PortfolioGateway } from './websocket/portfolio.gateway';

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
    RuleModule, 
    RuleValidatorModule,
    AssetPriceTestModule,
    OrderFulfilmentModule,
  ],
  providers: [SqsService, SqsPollingService, AssetPriceTestService, PortfolioGateway],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly assetPriceTestService: AssetPriceTestService) {}

  onModuleInit() {
    this.assetPriceTestService.startPopulating(); 
  }
}