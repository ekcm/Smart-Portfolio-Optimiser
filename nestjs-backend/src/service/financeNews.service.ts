import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FinanceNews } from '../model/financeNews.model';


@Injectable()
export class FinanceNewsService {
    constructor(@InjectModel(FinanceNews.name) private financeNewsModel: Model<FinanceNews>) { }

    async getAll(): Promise<FinanceNews[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const news = await this.financeNewsModel.find().exec();
                resolve(news);
            }, 1000);
        });
    }

    async getById(id: string): Promise<FinanceNews> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const news = await this.financeNewsModel.findById(id).exec();
                if (news) {
                    resolve(news);
                } else {
                    reject(new NotFoundException("No such Finance News was found"))
                }
            }, 1000)
        })
    }
    
    async getByTicker(ticker: string): Promise<FinanceNews> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const news = await this.financeNewsModel.findOne({ ticker: ticker }).exec();
                if (news) {
                    resolve(news);
                } else {
                    reject(new NotFoundException("No such Finance News was found"))
                }
            }, 1000)
        })
    }
    async getByTickerLatest(ticker: string): Promise<FinanceNews> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const news = await this.financeNewsModel.findOne({ ticker: ticker }).sort({ date: - 1 }).exec();
                if (news) {
                    resolve(news);
                } else {
                    reject(new NotFoundException("No such Finance News was found"))
                }
            }, 1000)
        })
    }

    async getLatestByTickers(tickers: string[]): Promise<FinanceNews[]> {
        return new Promise((resolve) =>  {
            setTimeout(async () => {
                const news = await this.financeNewsModel.aggregate([
                    {
                        $match: {
                            ticker: { $in: tickers },
                        },
                    },
                    {
                        $sort: {
                            date: -1,
                        },
                    },
                    {
                        $group: {
                            _id: "$ticker",
                            latestNews: { $first: "$$ROOT"},
                        },
                    },
                    {
                        $replaceRoot: { newRoot: "$latestNews"}
                    }
                ]).exec()
                
                resolve(news)
            }, 1000)
        })
    }



}