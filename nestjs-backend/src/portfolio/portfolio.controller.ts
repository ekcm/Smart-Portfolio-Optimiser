import { Controller, Get } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";

@Controller("portfolio")
export class PortfolioController {
  constructor(
    private portfolioService: PortfolioService
  ) {}

  @Get()
  getPortfolios(){
    return this.portfolioService.getAllPortfolios();
  }

}