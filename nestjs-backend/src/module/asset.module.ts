import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetController } from '../controller/asset.controller';
import { AssetService } from '../service/asset.service';
import { Asset, AssetSchema } from '../model/asset.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }])
    ],
    controllers: [AssetController],
    providers: [AssetService],
})
export class AssetModule {}