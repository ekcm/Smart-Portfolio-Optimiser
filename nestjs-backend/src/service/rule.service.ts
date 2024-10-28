import { Injectable, NotFoundException } from '@nestjs/common';
import { Portfolio } from 'src/model/portfolio.model';
import { PortfolioService } from './portfolio.service';
import { RuleLogService } from './ruleLog.service';

@Injectable()
export class RuleService {
    constructor(private portfolioService: PortfolioService, private ruleLogService: RuleLogService) {}

    async setMinCashAmount(portfolioId: string, percentage: number): Promise<Portfolio> {
        const portfolio = await this.portfolioService.getById(portfolioId);
        if (!portfolio) {
            throw new NotFoundException(`Portfolio #${portfolioId} not found`);
        }

        
        return this.portfolioService.updateMinCashPercentage(portfolioId, percentage);
    }

    async setMaxCashAmount(portfolioId: string, percentage: number): Promise<Portfolio> {
        const portfolio = await this.portfolioService.getById(portfolioId);
        if (!portfolio) {
            throw new NotFoundException(`Portfolio #${portfolioId} not found`);
        }

        return this.portfolioService.updateMaxCashPercentage(portfolioId, percentage);
    }


}