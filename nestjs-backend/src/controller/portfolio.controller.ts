import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PortfolioDto } from "../dto/portfolio.dto";
import { Portfolio } from "../model/portfolio.model";
import { PortfolioService } from "../service/portfolio.service";

@ApiTags("Portfolio Service")
@Controller("portfolio")
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) { }

  @Get()
  @ApiOperation({ summary: "Get all Portfolios" })
  async getAll(): Promise<Portfolio[]> {
    return await this.portfolioService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Get one Portfolio by ID" })
  async getByPortfolioId(@Param('id') id: string): Promise<Portfolio> {
    return await this.portfolioService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a Portfolio" })
  async create(@Body() PortfolioDto: PortfolioDto): Promise<Portfolio> {
    return await this.portfolioService.create(PortfolioDto);
  }
}