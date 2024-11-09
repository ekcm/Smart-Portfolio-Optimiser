import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderFulfilmentService } from '../service/orderFulfilment.service';
import { OrderService } from '../service/order.service';
import { PortfolioService } from '../service/portfolio.service';
import { PortfolioCalculatorService } from '../service/portfolioCalculator.service';
import { PortfolioHoldingsService } from '../service/portfolioHoldings.service';
import { AssetService } from '../service/asset.service';
import { AssetPriceService } from '../service/assetprice.service';
import { Order, OrderSchema } from '../model/order.model';
import { Portfolio, PortfolioSchema } from '../model/portfolio.model';
import { Asset, AssetSchema } from '../model/asset.model';
import { AssetPrice, AssetPriceSchema } from '../model/assetprice.model';
import { AssetPriceModule } from './assetprice.module'; 
import { PortfolioGateway } from '../websocket/portfolio.gateway';
import { AssetPriceTestModule } from './assetpricetest.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },          
      { name: Portfolio.name, schema: PortfolioSchema },  
      { name: Asset.name, schema: AssetSchema }, 
      { name: AssetPrice.name, schema: AssetPriceSchema },
    ]),
    AssetPriceModule, 
    AssetPriceTestModule,
  ],
  providers: [
    OrderFulfilmentService,
    OrderService,
    PortfolioService,
    PortfolioCalculatorService,
    PortfolioHoldingsService,
    AssetService,
    AssetPriceService,
    PortfolioGateway,
  ],
  exports: [OrderFulfilmentService],
})
export class OrderFulfilmentModule {}