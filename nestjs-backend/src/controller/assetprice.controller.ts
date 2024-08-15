import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AssetPriceService } from '../service/assetprice.service';
import { AssetPriceDto } from '../dto/assetprice.dto';
import { AssetPrice } from '../model/assetprice.model';

@Controller('assetprice')
export class AssetPriceController {
  constructor(private readonly assetPriceService: AssetPriceService) {}

  @Get()
  async getAll(): Promise<AssetPrice[]> {
    return this.assetPriceService.getAll();
  }

  @Get(':ticker')
  async getByTicker(@Param('ticker') ticker: string): Promise<AssetPrice[]> {
    return this.assetPriceService.getByTicker(ticker);
  }

  @Get(':ticker/:date')
  async getByTickerAndDate(@Param('ticker') ticker: string, @Param('date') date: string): Promise<AssetPrice> {
    const parsedDate = new Date(date);
    return this.assetPriceService.getByTickerAndDate(ticker, parsedDate);
  }

  @Post()
  async create(@Body() assetPriceDto: AssetPriceDto): Promise<AssetPrice> {
    return this.assetPriceService.create(assetPriceDto);
  }

  @Put(':ticker/:date')
  async update(@Param('ticker') ticker: string, @Param('date') date: string, @Body() updateDto: AssetPriceDto): Promise<AssetPrice> {
    const parsedDate = new Date(date);
    return this.assetPriceService.update(ticker, parsedDate, updateDto);
  }

  @Delete(':ticker/:date')
  async delete(@Param('ticker') ticker: string, @Param('date') date: string): Promise<void> {
    const parsedDate = new Date(date);
    return this.assetPriceService.delete(ticker, parsedDate);
  }
}