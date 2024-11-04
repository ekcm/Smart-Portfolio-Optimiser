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
import { RuleModule } from './module/rule.module';
import { RuleHandlerModule } from './module/ruleHandler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
        // directConnection: true,
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
    RuleHandlerModule,
    RuleLogModule, 
    RuleValidatorModule,
  ],
})
export class AppModule {}
