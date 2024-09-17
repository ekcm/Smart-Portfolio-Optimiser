import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AssetPriceDto } from "../dto/assetprice.dto";
import { AssetPrice } from "../model/assetprice.model";

@Injectable()
export class AssetPriceService {
  constructor(@InjectModel(AssetPrice.name) private assetPriceModel: Model<AssetPrice>) { }

  async getAll(): Promise<AssetPrice[]> {
    return await this.assetPriceModel.find().exec();
  }

  async getByTicker(ticker: string): Promise<AssetPrice[]> {
    const assetPrices = await this.assetPriceModel.find({ ticker }).exec();
    if (assetPrices && assetPrices.length > 0) {
      return assetPrices;
    } else {
      throw new NotFoundException(`Asset prices with ticker ${ticker} not found`);
    }
  }

  async getByTickerAndDate(ticker: string, date: Date): Promise<AssetPrice> {
    const assetPrice = await this.assetPriceModel.findOne({ ticker, date }).exec();
    if (assetPrice) {
      return assetPrice;
    } else {
      throw new NotFoundException(`AssetPrice with ticker ${ticker} on ${date.toISOString().split('T')[0]} not found`);
    }
  }

  async getByTickerLatest(ticker: string): Promise<AssetPrice> {
    const assetPrice = await this.assetPriceModel.findOne({ ticker }).sort({ date: -1 }).exec();
    if (assetPrice) {
      return assetPrice;
    } else {
      throw new NotFoundException(`AssetPrice with ticker ${ticker} not found`);
    }
  }

  async create(assetPriceDto: AssetPriceDto): Promise<AssetPrice> {
    console.log('Attempting to insert asset price:', assetPriceDto);  // Debugging log
  
    // Convert date string to Date object if necessary
    if (typeof assetPriceDto.date === 'string') {
      assetPriceDto.date = new Date(assetPriceDto.date);  // Convert string to Date
    }
  
    try {
      const createdAssetPrice = new this.assetPriceModel(assetPriceDto);
      const result = await createdAssetPrice.save();
      console.log('Inserted data:', result);  // Confirm insertion
      return result;
    } catch (error) {
      console.error('Error inserting data:', error.message);  // Log the error message
      throw new Error('Failed to insert asset price into DB');  // General error to prevent sensitive details leakage
    }
  }  

  async update(ticker: string, date: Date, updateDto: AssetPriceDto): Promise<AssetPrice> {
    const updatedAssetPrice = await this.assetPriceModel.findOneAndUpdate(
      { ticker, date },
      updateDto,
      { new: true }
    ).exec();

    if (!updatedAssetPrice) {
      throw new NotFoundException(`AssetPrice with ticker ${ticker} on ${date.toISOString().split('T')[0]} not found`);
    } else {
      return updatedAssetPrice;
    }
  }

  async delete(ticker: string, date: Date): Promise<void> {
    const result = await this.assetPriceModel.findOneAndDelete({ ticker, date }).exec();

    if (!result) {
      throw new NotFoundException(`AssetPrice with ticker ${ticker} on ${date.toISOString().split('T')[0]} not found`);
    }
  }

  async getLatest(ticker: string): Promise<AssetPrice> {
    const result = await this.assetPriceModel.findOne().sort({ date: -1}).exec()
    if (!result) {
      throw new NotFoundException(`AssetPrice with ticker ${ticker} not found`)
    }
    return result
  }

  async getAllExcept(tickers: string[] = []): Promise<AssetPrice[]> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const assetPrices = await this.assetPriceModel.find({
          ticker: { $nin: tickers },
        }).exec();
        resolve(assetPrices);
      }, 1000)
    })
  }
}