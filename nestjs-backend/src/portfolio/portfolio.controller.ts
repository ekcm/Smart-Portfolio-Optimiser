import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { Portfolio } from "./portfolio.model";

@Controller("portfolio")
export class PortfolioController {
  constructor(
    private portfolioService: PortfolioService
  ) {}

  @Get()
  getAllPortfolios(){
    return this.portfolioService.getAllPortfolios();
  }

  @Get('/:id')
  getPortfolioById(@Param('id') id: string){
    return this.portfolioService.getPortfolioById(id);
  }

  @Post()
  createPortfolio(@Body() portfolio: Portfolio){
    return this.portfolioService.createPortfolio(portfolio);
  }
}