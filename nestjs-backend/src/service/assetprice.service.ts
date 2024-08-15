import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AssetPriceDto } from "../dto/assetprice.dto";
import { AssetPrice } from "../model/assetprice.model";

@Injectable()
export class AssetPriceService {
  constructor(@InjectModel(AssetPrice.name) private assetPriceModel: Model<AssetPrice>) { }

  async getAll(): Promise<AssetPrice[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.assetPriceModel.find().exec());
      }, 1000);
    });
  }

  async getByTicker(ticker: string): Promise<AssetPrice[]> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const assetPrices = await this.assetPriceModel.find({ ticker }).exec();
        if (assetPrices && assetPrices.length > 0) {
          resolve(assetPrices);
        } else {
          reject(new NotFoundException(`Asset prices with ticker ${ticker} not found`));
        }
      }, 1000);
    });
  }

  async getByTickerAndDate(ticker: string, date: Date): Promise<AssetPrice> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const assetPrice = await this.assetPriceModel.findOne({ ticker, date }).exec();
        if (assetPrice) {
          resolve(assetPrice);
        } else {
          reject(new NotFoundException(`AssetPrice with ticker ${ticker} on ${date.toISOString().split('T')[0]} not found`));
        }
      }, 1000);
    });
  }

  async create(assetPriceDto: AssetPriceDto): Promise<AssetPrice> {
    return new Promise((resolve, reject) => {
      const createdAssetPrice = new this.assetPriceModel(assetPriceDto);
      setTimeout(async () => {
        try {
          const existingAssetPrice = await this.assetPriceModel.findOne({
            ticker: assetPriceDto.ticker,
            date: assetPriceDto.date,
          }).exec();

          if (existingAssetPrice) {
            reject(new ConflictException(`An asset price record for ticker ${assetPriceDto.ticker} on ${assetPriceDto.date.toISOString().split('T')[0]} already exists`));
          } else {
            resolve(await createdAssetPrice.save());
          }
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }

  async update(ticker: string, date: Date, updateDto: AssetPriceDto): Promise<AssetPrice> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const updatedAssetPrice = await this.assetPriceModel.findOneAndUpdate(
            { ticker, date },  
            updateDto,         
            { new: true }      
          ).exec();

          if (!updatedAssetPrice) {
            reject(new NotFoundException(`AssetPrice with ticker ${ticker} on ${date.toISOString().split('T')[0]} not found`));
          } else {
            resolve(updatedAssetPrice);
          }
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }

  async delete(ticker: string, date: Date): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await this.assetPriceModel.findOneAndDelete({ ticker, date }).exec();

          if (!result) {
            reject(new NotFoundException(`AssetPrice with ticker ${ticker} on ${date.toISOString().split('T')[0]} not found`));
          } else {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }
}