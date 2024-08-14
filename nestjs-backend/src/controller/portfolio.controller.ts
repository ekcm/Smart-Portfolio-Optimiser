import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PortfolioService } from "../service/portfolio.service";
import { Portfolio } from "../model/portfolio.model";
import { PortfolioDto } from "../dto/portfolio.dto";

@Controller("portfolio")
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get()
  async getAll(): Promise<Portfolio[]> {
    return await this.portfolioService.getAll();
  }

  @Get(':portfolioId')
  async getByPortfolioId(@Param('portfolioId') id: string): Promise<Portfolio> {
    return await this.portfolioService.getByPortfolioId(id);
  }

  @Post()
  async create(@Body() PortfolioDto: PortfolioDto): Promise<Portfolio> {
    return this.portfolioService.create(PortfolioDto);
  }
}