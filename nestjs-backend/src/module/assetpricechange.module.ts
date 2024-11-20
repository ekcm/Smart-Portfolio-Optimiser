import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetPriceChangeService } from '../service/assetpricechange.service';
import { AssetPrice, AssetPriceSchema } from '../model/assetprice.model';
import { SqsService } from '../service/sqs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AssetPrice.name, schema: AssetPriceSchema }]),
  ],
  providers: [AssetPriceChangeService, SqsService],
  exports: [AssetPriceChangeService],
})
export class AssetPriceChangeModule {}