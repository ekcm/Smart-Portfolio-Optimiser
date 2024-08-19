import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Portfolio, PortfolioSchema } from "src/model/portfolio.model";
import { PortfolioController } from "../controller/portfolio.controller";
import { PortfolioService } from "../service/portfolio.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Portfolio.name, schema: PortfolioSchema }])
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})

export class PortfolioModule {}
