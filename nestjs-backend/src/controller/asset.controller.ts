import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { AssetService } from "../service/asset.service";
import { AssetDto } from "../dto/asset.dto";
import { Asset } from "../model/asset.model";

@Controller("asset")
export class AssetController {
    constructor(private readonly assetService: AssetService) {}

    @Get()
    async getAllAssets(): Promise<Asset[]> {
        return await this.assetService.getAllAssets();
    }

    @Get('/:id')
    async getAssetById(@Param('id') id: string): Promise<Asset> {
        try {
            return await this.assetService.getAssetById(id);
        } catch (error) {
            throw new Error('Asset not found');
        }
    }

    @Post()
    async createAsset(@Body() assetDto: AssetDto): Promise<Asset> {
        return await this.assetService.createAsset(assetDto);
    }

    @Put('/:id')
    async updateAsset(@Param('id') id: string, @Body() assetDto: AssetDto): Promise<Asset> {
        try {
            return await this.assetService.updateAsset(id, assetDto);
        } catch (error) {
            throw new Error('Asset not found');
        }
    }

    @Delete('/:id')
    async deleteAsset(@Param('id') id: string): Promise<void> {
        try {
            await this.assetService.deleteAsset(id);
        } catch (error) {
            throw new Error('Asset not found');
        }
    }
}