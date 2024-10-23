import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PortfolioRule } from '../model/portfolioRule.model';
import { PortfolioRuleDto } from '../dto/portfolioRule.dto';

@Injectable()
export class PortfolioRuleService {
    constructor(@InjectModel(PortfolioRule.name) private portfolioRuleModel: Model<PortfolioRule>) {}

    async getAll(): Promise<PortfolioRule[]> {
        return await this.portfolioRuleModel.find().populate('rules').exec();
    }

    async getByPortfolioId(portfolioId: string): Promise<PortfolioRule> {
        const portfolioRule = await this.portfolioRuleModel.findOne({ portfolioId }).populate('rules').exec();
        if (!portfolioRule) {
            throw new NotFoundException(`Portfolio with ID ${portfolioId} not found`);
        }
        return portfolioRule;
    }

    async create(portfolioRuleDto: PortfolioRuleDto): Promise<PortfolioRule> {
        const createdPortfolioRule = new this.portfolioRuleModel(portfolioRuleDto);
        return await createdPortfolioRule.save();
    }

    async update(portfolioId: string, portfolioRuleDto: PortfolioRuleDto): Promise<PortfolioRule> {
        const updatedPortfolioRule = await this.portfolioRuleModel.findOneAndUpdate(
            { portfolioId },
            portfolioRuleDto,
            { new: true }
        ).populate('rules').exec();
        if (!updatedPortfolioRule) {
            throw new NotFoundException(`Portfolio with ID ${portfolioId} not found`);
        }
        return updatedPortfolioRule;
    }

    async delete(portfolioId: string): Promise<void> {
        const deletedPortfolioRule = await this.portfolioRuleModel.findOneAndDelete({ portfolioId }).exec();
        if (!deletedPortfolioRule) {
            throw new NotFoundException(`Portfolio with ID ${portfolioId} not found`);
        }
    }
}