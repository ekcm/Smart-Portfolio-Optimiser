import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { AssetService } from "../service/asset.service";
import { AssetDto } from "../dto/asset.dto";
import { Asset } from "../model/asset.model";

@Controller("asset")
export class AssetController {
    constructor(private readonly assetService: AssetService) { }

    @Get()
    async getAllAssets(): Promise<Asset[]> {
        return await this.assetService.getAllAssets();
    }

    @Get('/:ticker')
    async getAssetById(@Param('ticker') ticker: string): Promise<Asset> {
        return await this.assetService.getAssetByTicker(ticker);

    }

    @Post()
    async createAsset(@Body() assetDto: AssetDto): Promise<Asset> {
        return await this.assetService.createAsset(assetDto);
    }

    @Put('/:ticker')
    async updateAsset(@Param('ticker') ticker: string, @Body() assetDto: AssetDto): Promise<Asset> {
        return await this.assetService.updateAsset(ticker, assetDto);


    }

    @Delete('/:ticker')
    async deleteAsset(@Param('ticker') ticker: string): Promise<void> {
        await this.assetService.deleteAsset(ticker);

    }
}