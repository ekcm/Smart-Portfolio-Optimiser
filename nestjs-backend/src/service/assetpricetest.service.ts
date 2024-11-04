import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssetPriceDto } from '../dto/assetprice.dto';  
import { AssetPrice } from '../model/assetprice.model';  

@Injectable()
export class AssetPriceTestService {  
  constructor(
    @InjectModel('AssetPrice') private readonly assetPriceModel: Model<AssetPrice>, 
  ) {}

  async create(assetPriceDto: AssetPriceDto): Promise<AssetPrice> {  
    const newAssetPrice = new this.assetPriceModel(assetPriceDto); 
    const result = await newAssetPrice.save();

    return result; 
  }

  startPopulating() {
    setInterval(async () => {
      const randomAssetPrice: AssetPriceDto = {  
        ticker: 'AAPL',  
        company: 'Apple',
        sector: 'Information Technology',
        todayClose: 180,  
        yesterdayClose: 231.41,
        date: new Date(),  
      };

      await this.create(randomAssetPrice);
      console.log('Inserted new record and triggered SQS:', randomAssetPrice);
    }, 60000);  
  }
}