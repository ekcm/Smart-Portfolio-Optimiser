import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetPriceTestDto } from '../dto/assetpricetest.dto';  
import { AssetPriceTestService } from '../service/assetpricetest.service';  

@ApiTags('AssetPriceTest Service')
@Controller('assetprice-test') 
export class AssetPriceTestController {
  constructor(private readonly assetPriceTestService: AssetPriceTestService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new AssetPriceTest record and trigger SQS' })
  async create(@Body() assetPriceTestDto: AssetPriceTestDto) {
    return this.assetPriceTestService.create(assetPriceTestDto);
  }
}