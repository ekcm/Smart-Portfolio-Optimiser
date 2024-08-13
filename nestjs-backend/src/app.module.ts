import { Module } from '@nestjs/common';
import { PortfolioModule } from './module/portfolio.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './module/order.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_STRING),
    OrderModule,
    PortfolioModule
  ],
})
export class AppModule {}
