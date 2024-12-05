import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PortfolioDto } from "../dto/portfolio.dto";
import { Portfolio } from "../model/portfolio.model";
import { PortfolioService } from "../service/portfolio.service";

@ApiTags("Portfolio Service")
@Controller("portfolio")
export class PortfolioController {
    constructor(private portfolioService: PortfolioService) { }

    @Get()
    @ApiOperation({ summary: "Get all Portfolios" })
    @ApiResponse({
        status: 200,
        description: 'List of all portfolios',
        type: [PortfolioDto],
    })
    async getAll(): Promise<Portfolio[]> {
        return await this.portfolioService.getAll();
    }

    @Get(':id')
    @ApiOperation({ summary: "Get one Portfolio by ID" })
    @ApiParam({
        name: 'id',
        description: 'ID of the portfolio to fetch',
        required: true,
        example: 'portfolio123',
    })
    @ApiResponse({
        status: 200,
        description: 'The portfolio with the specified ID',
        type: PortfolioDto,
    })
    async getByPortfolioId(@Param('id') id: string): Promise<Portfolio> {
        return await this.portfolioService.getById(id);
    }

    @Post()
    @ApiOperation({ summary: "Create a Portfolio" })
    @ApiBody({
        description: 'The portfolio data to create a new portfolio',
        type: PortfolioDto,
    })
    @ApiResponse({
        status: 201,
        description: 'The portfolio has been successfully created',
        type: PortfolioDto,
    })
    async create(@Body() PortfolioDto: PortfolioDto): Promise<Portfolio> {
        return await this.portfolioService.create(PortfolioDto);
    }

    @Get('/manager/:manager')
    @ApiOperation({ summary: "Get all Portfolios under the management of a specific manager" })
    @ApiParam({
        name: 'manager',
        description: 'Manager ID for which to fetch the portfolios',
        required: true,
        example: 'manager123',
    })
    @ApiResponse({
        status: 200,
        description: 'List of portfolios managed by the specified manager',
        type: [PortfolioDto],
    })
    async getByManager(@Param('manager') manager: string): Promise<Portfolio[]> {
        return await this.portfolioService.getByManager(manager);
    }

    @Put(':id/cash')
    @ApiOperation({ summary: "Update cash" })
    @ApiParam({
        name: 'id',
        description: 'ID of the portfolio for which cash is being updated',
        required: true,
        example: 'portfolio123',
    })
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
    @ApiResponse({
        status: 200,
        description: 'The portfolio with updated cash amount',
        type: PortfolioDto,
    })
    async updateCash(@Param('id') id: string, @Body('cash amount') cash: number, @Body('type') type: "WITHDRAW" | "ADD"): Promise<Portfolio> {
        return await this.portfolioService.updateCash(id, cash, type);
    }
}