import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AssetPriceDto } from '../dto/assetprice.dto';
import { AssetPrice } from '../model/assetprice.model';
import { AssetPriceService } from '../service/assetprice.service';

@Controller('assetprice')
export class AssetPriceController {
  constructor(private readonly assetPriceService: AssetPriceService) { }

  @Get()
  @ApiOperation({ summary: 'Get all AssetPrices' })
  async getAll(): Promise<AssetPrice[]> {
    return this.assetPriceService.getAll();
  }

  @Get(':ticker')
  @ApiOperation({ summary: 'Get an array of all AssetPrices with ticker' })
  async getByTicker(@Param('ticker') ticker: string): Promise<AssetPrice[]> {
    return this.assetPriceService.getByTicker(ticker);
  }

  @Get(':ticker/:date')
  @ApiOperation({ summary: 'Get an AssetPrice with ticker and date' })
  async getByTickerAndDate(@Param('ticker') ticker: string, @Param('date') date: string): Promise<AssetPrice> {
    const parsedDate = new Date(date);
    return this.assetPriceService.getByTickerAndDate(ticker, parsedDate);
  }

  @Post()
  @ApiOperation({ summary: 'Create an AssetPrice' })
  async create(@Body() assetPriceDto: AssetPriceDto): Promise<AssetPrice> {
    return this.assetPriceService.create(assetPriceDto);
  }

  @Put(':ticker/:date')
  @ApiOperation({ summary: 'Update an AssetPrice by ticker and date' })
  async update(@Param('ticker') ticker: string, @Param('date') date: string, @Body() updateDto: AssetPriceDto): Promise<AssetPrice> {
    const parsedDate = new Date(date);
    return this.assetPriceService.update(ticker, parsedDate, updateDto);
  }

  @Delete(':ticker/:date')
  @ApiOperation({ summary: 'Delete an AssetPrice by ticker and date' })
  async delete(@Param('ticker') ticker: string, @Param('date') date: string): Promise<void> {
    const parsedDate = new Date(date);
    return this.assetPriceService.delete(ticker, parsedDate);
  }
}