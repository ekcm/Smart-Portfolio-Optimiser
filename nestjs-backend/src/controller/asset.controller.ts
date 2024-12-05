import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AssetDto } from "../dto/asset.dto";
import { Asset } from "../model/asset.model";
import { AssetService } from "../service/asset.service";

@ApiTags("Asset Service")
@Controller("asset")
export class AssetController {
	constructor(private readonly assetService: AssetService) { }

	@Get()
	@ApiOperation({ summary: "Get all Assets" })
	@ApiResponse({
		status: 200,
		description: "List of all assets",
		schema: {
		type: "array",
		items: {
			example: [
					{
						_id: "1",
						ticker: "AMGN",
						name: "Amgen",
						type: "STOCK",
						geography: "USA",
						industry: "Biopharmaceutical",
					},
					{
						_id: "2",
						ticker: "DOW",
						name: "Dow",
						type: "STOCK",
						geography: "USA",
						industry: "Chemical",
					},
					{
						_id: "3",
						ticker: "AAPL",
						name: "Apple",
						type: "STOCK",
						geography: "USA",
						industry: "Technology",
					},
				],
			},
		},
	})
	async getAll(): Promise<Asset[]> {
		return await this.assetService.getAll();
	}

	@Get('/:ticker')
	@ApiOperation({ summary: "Get one Asset by ticker" })
	@ApiParam({
		name: "ticker",
		description: "The ticker symbol of the asset",
		example: "AAPL",
	})
	@ApiResponse({
		status: 200,
		description: "Asset details by ticker",
		schema: {
		example: {
			_id: "3",
			ticker: "AAPL",
			name: "Apple",
			type: "STOCK",
			geography: "USA",
			industry: "Technology",
		},
		},
	})
	async getByTicker(@Param('ticker') ticker: string): Promise<Asset> {
		return await this.assetService.getByTicker(ticker);
	}

	@Post()
	@ApiOperation({ summary: "Create an Asset" })
	@ApiBody({
		description: "Details of the asset to create",
		type: AssetDto,
		examples: {
		example1: {
			summary: "Example Asset",
			value: {
			ticker: "GOOGL",
			name: "Alphabet Inc.",
			sector: "Technology",
			cost: 2800.5,
			},
		},
		},
	})
	@ApiResponse({
		status: 201,
		description: "Asset created successfully",
		schema: {
		example: {
			_id: "1",
			ticker: "AAPL",
			name: "Apple",
			type: "STOCK",
			geography: "USA",
			industry: "Technology",
		},
		},
	})
	async create(@Body() assetDto: AssetDto): Promise<Asset> {
		return await this.assetService.create(assetDto);
	}

	@Put('/:ticker')
	@ApiOperation({ summary: "Update an Asset by ticker" })
	@ApiParam({
		name: "ticker",
		description: "The ticker symbol of the asset to update",
		example: "MSFT",
	})
	@ApiBody({
		description: "Updated asset details",
		type: AssetDto,
		examples: {
		example1: {
			summary: "Updated Asset Example",
			value: {
				ticker: "MSFT",
				name: "Microsoft Corporation",
				type: "STOCK",
				geography: "USA",
				industry: "Technology",	
			},
		},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Asset updated successfully",
		schema: {
		example: {
			_id: "1",
			ticker: "AAPL",
			name: "Apple",
			type: "STOCK",
			geography: "USA",
			industry: "Technology",
		},
		},
	})
	async update(@Param('ticker') ticker: string, @Body() assetDto: AssetDto): Promise<Asset> {
		return await this.assetService.update(ticker, assetDto);
	}

	@Delete('/:ticker')
	@ApiOperation({ summary: "Delete an Asset by ticker" })
	@ApiParam({
		name: "ticker",
		description: "The ticker symbol of the asset to delete",
		example: "JPM",
	})
	@ApiResponse({
		status: 204,
		description: "Asset deleted successfully",
	})
	async delete(@Param('ticker') ticker: string): Promise<void> {
		await this.assetService.delete(ticker);
	}
}