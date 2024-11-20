import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssetPriceDto } from '../dto/assetprice.dto';
import { AssetPrice } from '../model/assetprice.model';
import * as fs from 'fs';
import * as path from 'path';
import * as dayjs from 'dayjs';

@Injectable()
export class AssetPriceTestService implements OnModuleInit {
  private jsonData: Record<string, AssetPriceDto[]> = {};
  private currentHour: dayjs.Dayjs | null = null;
  private currentHourKey: dayjs.Dayjs | null = null;
  private isAcknowledged = true;

  constructor(
    @InjectModel('AssetPrice') private readonly assetPriceModel: Model<AssetPrice>,
  ) {}

  async onModuleInit() {
    try {
      const filePath = path.join(__dirname, '../../stock_data_up.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      this.jsonData = JSON.parse(data);

      const firstKey = Object.keys(this.jsonData).sort()[0];
      this.currentHour = dayjs(firstKey);
      this.currentHourKey = this.currentHour;

      console.log('JSON data loaded. Starting at:', this.currentHour.format());

    } catch (error) {
      console.error('Failed to load JSON data:', error);
    }
  }

  async bulkInsertAssetPrices(assetPrices: AssetPriceDto[]) {
    try {
      await this.assetPriceModel.insertMany(assetPrices);
      console.log('Inserted records for batch:', assetPrices);
    } catch (error) {
      console.error('Error inserting asset prices:', error);
    }
  }

  async processNextBatch() {
    while (this.currentHourKey && this.currentHour) {
      if (!this.isAcknowledged) {
        console.log("Waiting for frontend acknowledgment...");
        return;  // Pause if not acknowledged
      }

      this.isAcknowledged = false;  

      const currentHourKeyString = this.currentHourKey.format('YYYY-MM-DDTHH:00:00');
      const allAssetPrices = this.jsonData[this.currentHour.format('YYYY-MM-DDTHH:00:00')] || [];

      const assetPrices = allAssetPrices.filter(
        (price) => dayjs(price.date).format('YYYY-MM-DDTHH:00:00') === currentHourKeyString
      );

      if (assetPrices.length > 0) {
        console.log(`Inserting ${assetPrices.length} records for hour ${currentHourKeyString}`);
        await this.bulkInsertAssetPrices(assetPrices);
      } else {
        console.log(`No records found for hour ${currentHourKeyString}`);
      }

      this.currentHourKey = this.currentHourKey.add(1, 'hour');

      if (this.currentHourKey.format('YYYY-MM-DDTHH:00:00') === this.currentHour.format('YYYY-MM-DDT07:00:00')) {
        this.currentHour = this.currentHour.add(1, 'day');
        this.currentHourKey = this.currentHour;

        const nextDayKey = this.currentHour.format('YYYY-MM-DDTHH:00:00');
        if (!this.jsonData[nextDayKey]) {
          console.log("No more data for subsequent days. Ending process.");
          break;
        }
      }
    }
  }

  async acknowledgeBatch() {
    console.log("Frontend acknowledged the batch. Ready for next.");
    setTimeout(async () => {
      this.isAcknowledged = true;
      await this.processNextBatch();  
    }, 3000);
  }
}