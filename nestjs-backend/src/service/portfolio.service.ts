import { Injectable, NotFoundException } from "@nestjs/common";
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

  async getByPortfolioId(portfolioId: string): Promise<Portfolio> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const portfolio = await this.portfolioModel.findOne({ portfolioId }).exec();
        if (portfolio) {
          resolve(portfolio);
        } else {
          reject(new NotFoundException(`Portfolio with ID ${portfolioId} not found`));
        }
      }, 1000);
    });
  }

  async create(portfolioDto: PortfolioDto): Promise<Portfolio> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const createdPortfolio = new this.portfolioModel(portfolioDto);
        resolve(createdPortfolio.save());
      }, 1000);
    })
  }
}

