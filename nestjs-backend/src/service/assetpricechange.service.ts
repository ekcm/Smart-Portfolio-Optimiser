import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssetPrice } from '../model/assetprice.model';
import { SqsService } from './sqs.service';

@Injectable()
export class AssetPriceChangeService implements OnModuleInit, OnModuleDestroy {
  private changeStream: any;
  private insertionBuffer: AssetPrice[] = []; 
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly batchInterval = 10000; 

  constructor(
    @InjectModel('AssetPrice') private readonly assetPriceModel: Model<AssetPrice>,
    private readonly sqsService: SqsService,
  ) {}

  async onModuleInit() {
    this.changeStream = this.assetPriceModel.watch();
    this.changeStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        const newDocument = change.fullDocument;
        this.insertionBuffer.push(newDocument);

        if (this.insertionBuffer.length === 1) {
          this.scheduleBatchSend();
        }
      }
    });
  }

  private scheduleBatchSend() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout); 
    }

    this.batchTimeout = setTimeout(async () => {
      await this.sendBatchToSqs();
    }, this.batchInterval);
  }

  private async sendBatchToSqs() {
    if (this.insertionBuffer.length > 0) {
      try {
        const message = JSON.stringify(this.insertionBuffer);
        await this.sqsService.sendMessage(message);
        console.log('Batch sent to SQS:', this.insertionBuffer);

        this.insertionBuffer = [];
      } catch (error) {
        console.error('Error sending batch to SQS:', error);
      }
    }
  }

  async onModuleDestroy() {
    await this.changeStream.close();
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
  }
}