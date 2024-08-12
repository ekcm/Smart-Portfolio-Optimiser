import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PortfolioService } from "../service/portfolio.service";
import { Portfolio } from "../model/portfolio.model";
import { CreatePortfolioDto } from "../dto/portfolio.dto";

@Controller("portfolio")
export class PortfolioController {
  constructor(
    private portfolioService: PortfolioService
  ) {}

  @Get()
  async getAllPortfolios(): Promise<Portfolio[]> {
    return await this.portfolioService.getAllPortfolios();
  }

  @Get('/:id')
  async getPortfolioById(@Param('id') id: string): Promise<{id: string}> {
    try {
      return await this.portfolioService.getPortfolioById(id);
    } catch (error) {
      return { id: 'Portfolio not found' };
    }
  }

  @Post()
  async createPortfolio(@Body() CreatePortfolioDto: CreatePortfolioDto): Promise<void> {
    await this.portfolioService.createPortfolio(CreatePortfolioDto);
  }
}