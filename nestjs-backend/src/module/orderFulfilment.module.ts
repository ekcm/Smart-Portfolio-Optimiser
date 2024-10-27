import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderFulfilmentService } from '../service/orderFulfilment.service';
import { OrderService } from '../service/order.service';
import { PortfolioService } from '../service/portfolio.service';
import { Order, OrderSchema } from '../model/order.model';
import { Portfolio, PortfolioSchema } from '../model/portfolio.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },          
      { name: Portfolio.name, schema: PortfolioSchema },  
    ]),
  ],
  providers: [OrderFulfilmentService, OrderService, PortfolioService],
  exports: [OrderFulfilmentService],
})
export class OrderFulfilmentModule {}

