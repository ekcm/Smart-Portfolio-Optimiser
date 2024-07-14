import { Body, Controller, Get, Post } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { Portfolio } from "./portfolio.model";

@Controller("portfolio")
export class PortfolioController {
  constructor(
    private portfolioService: PortfolioService
  ) {}

  @Get()
  getPortfolios(){
    return this.portfolioService.getAllPortfolios();
  }

  @Post()
  createPortfolio(@Body() portfolio: Portfolio){
    return this.portfolioService.createPortfolio(portfolio);
  }
}