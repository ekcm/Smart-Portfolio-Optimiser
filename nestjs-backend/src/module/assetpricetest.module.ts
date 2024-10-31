import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetPrice, AssetPriceSchema } from '../model/assetprice.model';  
import { AssetPriceController } from '../controller/assetprice.controller';  
import { AssetPriceService } from '../service/assetprice.service'; 
import { SqsService } from '../service/sqs.service';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AssetPrice.name, schema: AssetPriceSchema }]),
  ],
  controllers: [AssetPriceController],  
  providers: [AssetPriceService, SqsService],  
  exports: [AssetPriceService, MongooseModule],  
})
export class AssetPriceTestModule {}