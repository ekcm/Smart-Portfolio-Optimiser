import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AssetDto } from "../dto/asset.dto";
import { Asset } from "../model/asset.model";
import { AssetService } from "../service/asset.service";

@ApiTags("Asset Service")
@Controller("asset")
export class AssetController {
	constructor(private readonly assetService: AssetService) { }

	@Get()
	@ApiOperation({ summary: "Get all Assets" })
	async getAll(): Promise<Asset[]> {
		return await this.assetService.getAll();
	}

	@Get('/:ticker')
	@ApiOperation({ summary: "Get one Asset by ticker" })
	async getByTicker(@Param('ticker') ticker: string): Promise<Asset> {
		return await this.assetService.getByTicker(ticker);
	}

	@Post()
	@ApiOperation({ summary: "Create an Asset" })
	async create(@Body() assetDto: AssetDto): Promise<Asset> {
		return await this.assetService.create(assetDto);
	}

	@Put('/:ticker')
	@ApiOperation({ summary: "Update an Asset by ticker" })
	async update(@Param('ticker') ticker: string, @Body() assetDto: AssetDto): Promise<Asset> {
		return await this.assetService.update(ticker, assetDto);
	}

	@Delete('/:ticker')
	@ApiOperation({ summary: "Delete an Asset by ticker" })
	async delete(@Param('ticker') ticker: string): Promise<void> {
		await this.assetService.delete(ticker);
	}
}