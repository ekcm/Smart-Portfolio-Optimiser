import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PortfolioDto } from "../dto/portfolio.dto";
import { Portfolio } from "../model/portfolio.model";

@Injectable()
export class PortfolioService {
    constructor(@InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>) { }

    async getAll(): Promise<Portfolio[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.portfolioModel.find().exec());
            }, 1000);
        });
    }

    async getById(portfolioId: string): Promise<Portfolio> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const portfolio = await this.portfolioModel.findById(portfolioId).exec();
                if (portfolio) {
                    resolve(portfolio);
                } else {
                    reject(new NotFoundException(`Portfolio with ID ${portfolioId} not found`));
                }
            }, 1000);
        });
    }

    async create(portfolioDto: PortfolioDto): Promise<Portfolio> {
        return new Promise((resolve, reject) => {
            const createdPortfolio = new this.portfolioModel(portfolioDto);
            setTimeout(async () => {
                try {
                    resolve(await createdPortfolio.save());
                } catch (error) {
                    reject(new ConflictException("A portfolio with this portfolioId already exists"))
                }
            }, 1000)
        })
    }

    async getByManager(manager: string): Promise<Portfolio[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const portfolios = await this.portfolioModel.find({ manager }).exec();
                resolve(portfolios);
            }, 1000)
        })
    }

    async update(id: string, portfolioDto: PortfolioDto): Promise<Portfolio> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const existingPortfolio = await this.portfolioModel.findByIdAndUpdate(
                    id,
                    portfolioDto,
                    { new: true }
                );
                if (!existingPortfolio) {
                    reject(new NotFoundException('Portfolio #${id} not found'));
                } else {
                    resolve(existingPortfolio)
                }
            }, 1000)
        })
    }

    async updateCash(id: string, cashAmount: number, type: 'WITHDRAW' | 'ADD'): Promise<Portfolio> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const existingPortfolio = await this.portfolioModel.findById(id);
                if (!existingPortfolio) {
                    reject(new NotFoundException(`Portfolio #${id} not found`));
                }

                let newCashAmount = existingPortfolio.cashAmount;

                if (type === 'ADD') {
                    newCashAmount += cashAmount;
                } else if (type === 'WITHDRAW') {
                    if (existingPortfolio.cashAmount < cashAmount) {
                        reject(new BadRequestException('Insufficient funds for withdrawal'));
                    }
                    newCashAmount -= cashAmount;
                }

                const updatedPortfolio = await this.portfolioModel.findByIdAndUpdate(
                    id,
                    { cashAmount: newCashAmount },
                    { new: true }
                );

                resolve(updatedPortfolio);
            }, 1000)
        })

    }

    async getRulesByPortfolioId(portfolioId: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const portfolio = await this.portfolioModel.findById(portfolioId).exec();
                if (portfolio) {
                    resolve(portfolio.rules);
                } else {
                    reject(new NotFoundException(`Portfolio with ID ${portfolioId} not found`));
                }
            }, 1000);
        });
    }
    
}
