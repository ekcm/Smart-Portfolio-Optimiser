import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetPriceTest, AssetPriceTestSchema } from '../model/assetpricetest.model';  
import { AssetPriceTestController } from '../controller/assetpricetest.controller';  
import { AssetPriceTestService } from '../service/assetpricetest.service'; 
import { SqsService } from '../service/sqs.service';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AssetPriceUpdates', schema: AssetPriceTestSchema }]),
  ],
  controllers: [AssetPriceTestController],  
  providers: [AssetPriceTestService, SqsService],  
  exports: [AssetPriceTestService, MongooseModule],  
})
export class AssetPriceTestModule {}