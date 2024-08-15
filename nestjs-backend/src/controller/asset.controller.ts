import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AssetDto } from "../dto/asset.dto";
import { Asset } from "../model/asset.model";
import { AssetService } from "../service/asset.service";

@Controller("asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) { }

  @Get()
  async getAll(): Promise<Asset[]> {
    return await this.assetService.getAll();
  }

  @Get('/:ticker')
  async getById(@Param('ticker') ticker: string): Promise<Asset> {
    return await this.assetService.getByTicker(ticker);

  }

  @Post()
  async create(@Body() assetDto: AssetDto): Promise<Asset> {
    return await this.assetService.create(assetDto);
  }

  @Put('/:ticker')
  async update(@Param('ticker') ticker: string, @Body() assetDto: AssetDto): Promise<Asset> {
    return await this.assetService.update(ticker, assetDto);


  }

  @Delete('/:ticker')
  async delete(@Param('ticker') ticker: string): Promise<void> {
    await this.assetService.delete(ticker);

  }
}