import { Module } from "@nestjs/common";
import { PortfolioController } from "../controller/portfolio.controller";
import { PortfolioService } from "../service/portfolio.service";

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}