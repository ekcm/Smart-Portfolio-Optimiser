import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PortfolioDto } from "../dto/portfolio.dto";
import { Portfolio } from "../model/portfolio.model";
import { HandleCash, PortfolioService } from "../service/portfolio.service";

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

    @Get('/manager/:manager')
    @ApiOperation({ summary: "Get all Portfolios under the management of a specific manager" })
    async getByManager(@Param('manager') manager: string): Promise<Portfolio[]> {
        return await this.portfolioService.getByManager(manager);
    }

    @Put(':id/cash')
    @ApiOperation({ summary: "Add cash" })
    async addCash(@Param('id') id: string, @Query('cash amount') cash: number, @Query('type') type : HandleCash): Promise<Portfolio> {
        return await this.portfolioService.addCash(id, cash, type);
    }
}