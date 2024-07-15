import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { Portfolio } from "./portfolio.model";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";

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
  createPortfolio(@Body() CreatePortfolioDto: CreatePortfolioDto): Portfolio {
    return this.portfolioService.createPortfolio(CreatePortfolioDto);
  }
}