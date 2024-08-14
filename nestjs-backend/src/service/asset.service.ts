import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset } from '../model/asset.model';
import { AssetDto } from '../dto/asset.dto';

// TODO
// implement timeout
// throw js exceptions instead of generic errors
// convert find to mongoose methods
@Injectable()
export class AssetService {
    constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}

    async getAllAssets(): Promise<Asset[]> {
        return this.assetModel.find().exec();
    }

    async getAssetById(id: string): Promise<Asset> {
        const asset = await this.assetModel.findById(id).exec();
        if (!asset) {
            throw new Error('Asset not found');
        }
        return asset;
    }

    async createAsset(assetDto: AssetDto): Promise<Asset> {
        const createdAsset = new this.assetModel(assetDto);
        return createdAsset.save();
    }

    async updateAsset(id: string, assetDto: AssetDto): Promise<Asset> {
        const updatedAsset = await this.assetModel.findByIdAndUpdate(id, assetDto, { new: true }).exec();
        if (!updatedAsset) {
            throw new Error('Asset not found');
        }
        return updatedAsset;
    }

    async deleteAsset(id: string): Promise<void> {
        const deletedAsset = await this.assetModel.findByIdAndDelete(id).exec();
        if (!deletedAsset) {
            throw new Error('Asset not found');
        }
    }
}