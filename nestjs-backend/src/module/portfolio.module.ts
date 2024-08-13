import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioController } from '../controller/portfolio.controller';
import { PortfolioService } from '../service/portfolio.service';
import { Portfolio, PortfolioSchema } from '../model/portfolio.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Portfolio.name, schema: PortfolioSchema }]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}