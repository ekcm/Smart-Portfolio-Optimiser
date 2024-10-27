import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssetPriceTestDto } from '../dto/assetpricetest.dto';  
import { AssetPriceTest } from '../model/assetpricetest.model';  
import { SqsService } from './sqs.service';  

@Injectable()
export class AssetPriceTestService {
  constructor(
    @InjectModel('AssetPriceUpdates') private readonly assetPriceTestModel: Model<AssetPriceTest>, 
    private readonly sqsService: SqsService, 
  ) {}

  async create(assetPriceTestDto: AssetPriceTestDto): Promise<AssetPriceTest> {
    const newAssetPrice = new this.assetPriceTestModel(assetPriceTestDto);
    const result = await newAssetPrice.save();

    await this.sqsService.sendMessage(JSON.stringify(result));

    return result; 
  }

  startPopulating() {
    setInterval(async () => {
      const randomAssetPrice: AssetPriceTestDto = {
        ticker: 'AAPL',  
        company: 'Apple',
        sector: 'Information Technology',
        todayClose: 5,  
        yesterdayClose: 226.21,
        date: new Date(),  
      };

      await this.create(randomAssetPrice);
      console.log('Inserted new record and triggered SQS:', randomAssetPrice);
    }, 120000);  
  }
}
