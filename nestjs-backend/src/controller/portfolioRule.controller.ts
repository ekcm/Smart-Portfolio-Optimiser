import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PortfolioRuleService } from '../service/portfolioRule.service';
import { PortfolioRule } from '../model/portfolioRule.model';
import { PortfolioRuleDto } from '../dto/portfolioRule.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Portfolio Rule Service')
@Controller('portfolioRule')
export class PortfolioRuleController {
    constructor(private readonly portfolioRuleService: PortfolioRuleService) {}

    @Get()
    @ApiOperation({ summary: 'Get all portfolio rules' })
    async getAll(): Promise<PortfolioRule[]> {
        return await this.portfolioRuleService.getAll();
    }

    @Get('/:portfolioId')
    @ApiOperation({ summary: 'Get portfolio rules by portfolio ID' })
    async getByPortfolioId(@Param('portfolioId') portfolioId: string): Promise<PortfolioRule> {
        return await this.portfolioRuleService.getByPortfolioId(portfolioId);
    }

    @Post()
    @ApiOperation({ summary: 'Create portfolio rules' })
    async create(@Body() portfolioRuleDto: PortfolioRuleDto): Promise<PortfolioRule> {
        return await this.portfolioRuleService.create(portfolioRuleDto);
    }

    @Put('/:portfolioId')
    @ApiOperation({ summary: 'Update portfolio rules' })
    async update(@Param('portfolioId') portfolioId: string, @Body() portfolioRuleDto: PortfolioRuleDto): Promise<PortfolioRule> {
        return await this.portfolioRuleService.update(portfolioId, portfolioRuleDto);
    }

    @Delete('/:portfolioId')
    @ApiOperation({ summary: 'Delete portfolio rules' })
    async delete(@Param('portfolioId') portfolioId: string): Promise<void> {
        await this.portfolioRuleService.delete(portfolioId);
    }
}