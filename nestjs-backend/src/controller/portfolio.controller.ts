import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
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

    @Get('/manager/:manager')
    @ApiOperation({ summary: "Get all Portfolios under the management of a specific manager" })
    async getByManager(@Param('manager') manager: string): Promise<Portfolio[]> {
        return await this.portfolioService.getByManager(manager);
    }

    @Put(':id/cash')
    @ApiOperation({ summary: "Add cash " })
    @ApiBody({
        description: 'Cash amount to be added or withdrawn',
        examples: {
            default: {
                summary: 'Example add cash',
                value:
                {
                    "cash amount": 10000,
                    "type": "ADD"
                }

            }
        }
    })
    async updateCash(@Param('id') id: string, @Body('cash amount') cash: number, @Body('type') type: "WITHDRAW" | "ADD"): Promise<Portfolio> {
        return await this.portfolioService.updateCash(id, cash, type);
    }
}