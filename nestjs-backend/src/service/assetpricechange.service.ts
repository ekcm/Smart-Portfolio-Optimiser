import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssetPrice } from '../model/assetprice.model';
import { SqsService } from './sqs.service';

@Injectable()
export class AssetPriceChangeService implements OnModuleInit, OnModuleDestroy {
  private changeStream: any;

  constructor(
    @InjectModel('AssetPrice') private readonly assetPriceModel: Model<AssetPrice>,
    private readonly sqsService: SqsService,
  ) {}

  async onModuleInit() {
    this.changeStream = this.assetPriceModel.watch();
    this.changeStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        const newDocument = change.fullDocument;
        console.log('New document inserted:', newDocument);
        
        await this.sqsService.sendMessage(JSON.stringify(newDocument));
      }
    });
  }

  async onModuleDestroy() {
    await this.changeStream.close();
  }
}