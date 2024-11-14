import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, set } from 'mongoose';
import { AssetDto } from '../dto/asset.dto';
import { Asset, AssetType } from '../model/asset.model';


@Injectable()
export class AssetService {
    constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) { }

    async getAll(): Promise<Asset[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const assets = await this.assetModel.find().exec();
                resolve(assets);
            }, 1000);
        });
    }
    
    async getByTicker(ticker: string): Promise<Asset> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const asset = await this.assetModel.findOne({ ticker: ticker }).exec();
                if (asset) {
                    resolve(asset);
                } else {
                    reject(new NotFoundException("Not such asset was found"))
                }
            }, 1000)
        })
    }

    async create(assetDto: AssetDto): Promise<Asset> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const createdOrder = new this.assetModel(assetDto);
                resolve(await createdOrder.save());
            }, 1000);
        })
    }

    async update(ticker: string, assetDto: AssetDto): Promise<Asset> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const existingAsset = await this.assetModel.findOneAndUpdate(
                    { ticker: ticker },
                    assetDto,
                    { new: true }
                );
                if (!existingAsset) {
                    reject(new NotFoundException('${ticker} does not exist'));
                } else {
                    resolve(existingAsset)
                }
            }, 1000)
        })
    }

    async delete(ticker: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const asset = await this.assetModel.findOneAndDelete({ ticker: ticker });
                if (!asset) {
                    reject(new NotFoundException('{ticker} does not exist'));
                } else {
                    resolve();
                }
            }, 1000)
        })
    }

    async getAllExcept(tickers: string[] = []): Promise<Asset[]> {
        return new Promise((resolve) => {
            setTimeout(async() => {
                const assets = await this.assetModel.find({
                    ticker: {$nin: tickers},
                }).exec();
                resolve(assets);
            }, 1000)
        })
    }
    async getAllFrom(tickers: string[]): Promise<Asset[]> {
        return new Promise((resolve) => {
            setTimeout(async() => {
                const assets = await this.assetModel.find({
                    ticker: {$in: tickers},
                }).exec();
                resolve(assets);
            }, 1000)
        })
    }
    async getAllStocksFrom(tickers: string[]): Promise<Asset[]> {
        return new Promise((resolve) => {
            setTimeout(async() => {
                const assets = await this.assetModel.find({
                    type: AssetType.STOCK,
                    ticker: {$in: tickers},
                }).exec();
                resolve(assets);
            }, 1000)
        })
    }
    async getAllBondsFrom(tickers: string[]): Promise<Asset[]> {
        return new Promise((resolve) => {
            setTimeout(async() => {
                const assets = await this.assetModel.find({
                    type: AssetType.BOND,
                    ticker: {$in: tickers},
                }).exec();
                resolve(assets);
            }, 1000)
        })
    }
    
    async getAllStockExcept(exclusions: string[]): Promise<Asset[]> {
        return new Promise((resolve) => {
            setTimeout(async() => {
                const assets = await this.assetModel.find({
                    type: AssetType.STOCK,
                    ticker: {$nin: exclusions},
                }).exec();
                resolve(assets)
            }, 1000)   
        })
    }

    async getAllBondsExcept(exclusions: string[]): Promise<Asset[]> {
        return new Promise((resolve) => {
            setTimeout(async() => {
                const assets = await this.assetModel.find({
                    type: AssetType.BOND,
                    ticker: {$nin: exclusions},
                }).exec();
                resolve(assets)
            }, 1000)   
        })
    }
}