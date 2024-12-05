import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssetPriceDto } from '../dto/assetprice.dto';
import { AssetPrice } from '../model/assetprice.model';
import { AssetPriceService } from '../service/assetprice.service';

@ApiTags('AssetPrice Service')
@Controller('assetprice')
export class AssetPriceController {
  constructor(private readonly assetPriceService: AssetPriceService) { }

  @Get()
  @ApiOperation({ summary: 'Get all AssetPrices' })
  @ApiResponse({
    status: 200,
    description: 'List of all asset prices',
    schema: {
      type: 'array',
      items: {
        example: [
          {
            _id: '60f6c72e0a9a2344a8d56fdb',
            ticker: 'AMGN',
            company: 'Amgen',
            sector: 'Biopharmaceutical',
            todayClose: 245.67,
            yesterdayClose: 244.98,
            date: '2024-12-01T00:00:00.000Z',
          },
          {
            _id: '60f6c72e0a9a2344a8d56fdb',
            ticker: 'DOW',
            company: 'Dow Chemical',
            sector: 'Chemical',
            todayClose: 56.45,
            yesterdayClose: 55.78,
            date: '2024-12-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  async getAll(): Promise<AssetPrice[]> {
    return this.assetPriceService.getAll();
  }

  @Get(':ticker')
  @ApiOperation({ summary: 'Get an array of all AssetPrices with ticker' })
  @ApiParam({
		name: "ticker",
		description: "The ticker symbol of the asset",
		example: "AAPL",
	})
  @ApiResponse({
    status: 200,
    description: 'Asset prices for a specific ticker',
    schema: {
      type: 'array',
      items: {
        example: [
          {
            _id: '60f6c72e0a9a2344a8d56fdb',
            ticker: 'AMGN',
            company: 'Amgen',
            sector: 'Biopharmaceutical',
            todayClose: 245.67,
            yesterdayClose: 244.98,
            date: '2024-12-01T00:00:00.000Z',
          },
          {
            _id: '638029d0a9a2344a8d56fdb',
            ticker: 'AAPL',
            company: 'Apple',
            sector: 'Technology',
            todayClose: 130.25,
            yesterdayClose: 125.98,
            date: '2024-12-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  async getByTicker(@Param('ticker') ticker: string): Promise<AssetPrice[]> {
    return this.assetPriceService.getByTicker(ticker);
  }

  @Get(':ticker/:date')
  @ApiOperation({ summary: 'Get an AssetPrice with ticker and date' })
  @ApiParam({
		name: "ticker",
		description: "The ticker symbol of the asset",
		example: "AAPL",
	})
  @ApiParam({
		name: "date",
		description: "The price of asset at a specific date",
		example: "2024-12-01T00:00:00.000Z",
	})
  @ApiResponse({
    status: 200,
    description: 'Asset price for a specific ticker and date',
    schema: {
      example: {
        _id: '60f6c72e0a9a2344a8d56fdb',
        ticker: 'AMGN',
        company: 'Amgen',
        sector: 'Biopharmaceutical',
        todayClose: 245.67,
        yesterdayClose: 244.98,
        date: '2024-12-01T00:00:00.000Z',
      },
    },
  })
  async getByTickerAndDate(@Param('ticker') ticker: string, @Param('date') date: string): Promise<AssetPrice> {
    const parsedDate = new Date(date);
    return this.assetPriceService.getByTickerAndDate(ticker, parsedDate);
  }

  @Post()
  @ApiOperation({ summary: 'Create an AssetPrice' })
  @ApiBody({
		description: "Create an asset price",
		type: AssetPrice,
		examples: {
		example1: {
			summary: "Create assetprice example",
			value: {
				ticker: "MSFT",
				name: "Microsoft Corporation",
        sector: "Information Technology",
				todayClose: 231.86000061035156,
				yesterdayClose: 228.8699951171875,
        date: '2024-12-01T00:00:00.000Z'
			},
		},
		},
	})
  @ApiResponse({
    status: 200,
    description: 'Asset price successfully created',
    schema: {
      example: {
        _id: '60f6c72e0a9a2344a8d56fdb',
        ticker: 'MSFT',
        company: 'Microsoft Corporation',
        sector: 'Information Technology',
        todayClose: 231.86000061035156,
        yesterdayClose: 228.8699951171875,
        date: '2024-12-01T00:00:00.000Z',
      },
    },
  })
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

  @Get('/all/excluding/tickers')
  @ApiOperation({ summary: 'Get all AssetPrice excluding specified' })
  @ApiQuery({
    name: 'exclusions',
    required: false,
    description: 'Tickers of excluded assets in the query',
    example: '["AAPL", "MSFT"]',
  })
  @ApiResponse({
    status: 200,
    description: 'List of asset prices excluding specified tickers',
    schema: {
      type: 'array',
      items: {
        example: [
          {
            _id: '60f6c72e0a9a2344a8d56fdb',
            ticker: 'AMGN',
            company: 'Amgen',
            sector: 'Biopharmaceutical',
            todayClose: 245.67,
            yesterdayClose: 244.98,
            date: '2024-12-01T00:00:00.000Z',
          },
          {
            _id: '60f6c72e0a9a2344a8d56fdb',
            ticker: 'DOW',
            company: 'Dow Chemical',
            sector: 'Chemical',
            todayClose: 56.45,
            yesterdayClose: 55.78,
            date: '2024-12-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  async getAllExcept(@Query('exclusions') exclusions: string[] = []): Promise<AssetPriceDto[]> {
    const assetPrices = await this.assetPriceService.getAllExcept(exclusions)
    return assetPrices
  }

  @Get('/all/from/tickers')
  @ApiQuery({ name: 'inclusions', required: true, description: 'tickers of included assets in the query'})
  @ApiOperation({ summary: 'Get all AssetPrice inclusive only of specified' })
  @ApiQuery({
    name: 'inclusions',
    required: false,
    description: 'Tickers of included assets in the query',
    example: '["AAPL", "MSFT"]',
  })
  @ApiResponse({
    status: 200,
    description: 'List of asset prices for specified tickers',
    schema: {
      type: 'array',
      items: {
        example: [
          {
            _id: '60f6c72e0a9a2344a8d56fdb',
            ticker: 'AMGN',
            company: 'Amgen',
            sector: 'Biopharmaceutical',
            todayClose: 245.67,
            yesterdayClose: 244.98,
            date: '2024-12-01T00:00:00.000Z',
          },
          {
            _id: '60f6c72e0a9a2344a8d56fdb',
            ticker: 'DOW',
            company: 'Dow Chemical',
            sector: 'Chemical',
            todayClose: 56.45,
            yesterdayClose: 55.78,
            date: '2024-12-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  async getFrom(@Query('inclusions') inclusions: string[]): Promise<AssetPriceDto[]> {
    const assetPrices = await this.assetPriceService.getFrom(inclusions)
    return assetPrices
  }
}