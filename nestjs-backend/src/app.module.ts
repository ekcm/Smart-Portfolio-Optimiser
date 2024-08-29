import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetModule } from './module/asset.module';
import { OrderModule } from './module/order.module';
import { PortfolioModule } from './module/portfolio.module';
import { AssetPriceModule } from './module/assetprice.module';
import { PortfolioCalculatorModule } from './module/portfolioCalculator.module';
import { CoreModule } from './module/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://fypportfolio:fypportfolio@localhost:27017/PortfolioManagement?tls=true&tlsCAFile=/Users/fyp/global-bundle.pem&tlsAllowInvalidHostnames=true',
        directConnection: true,
        retryWrites: false,
      }),
    }),
    OrderModule,
    PortfolioModule,
    AssetModule,
    AssetPriceModule,
    PortfolioCalculatorModule,
    CoreModule
  ],
})
export class AppModule {}
