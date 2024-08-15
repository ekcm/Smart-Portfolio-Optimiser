import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AssetModule } from './module/asset.module';
import { OrderModule } from './module/order.module';
import { PortfolioModule } from './module/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongodb = await MongoMemoryServer.create();
        const uri = mongodb.getUri();
        return {
          uri
        };
      },
    }),
    OrderModule,
    PortfolioModule,
    AssetModule
  ],
})
export class AppModule { }
