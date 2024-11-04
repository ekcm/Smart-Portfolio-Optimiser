import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RuleLogDto } from "../dto/ruleLog.dto";
import { RuleLog } from "../model/ruleLog.model";
import { RuleLogService } from "../service/ruleLog.service";

@ApiTags("Rule Log Service")
@Controller("ruleLog")
export class RuleLogController {
	constructor(private readonly ruleLogService: RuleLogService) {}

	@Get()
	@ApiOperation({ summary: "Get all Rules" })
	async getAll(): Promise<RuleLog[]> {
		return await this.ruleLogService.getAll();
	}

	@Get('/:id')
	@ApiOperation({ summary: "Get one Rule Log by ID" })
	async getById(@Param('id') id: string): Promise<RuleLog> {
		return await this.ruleLogService.getById(id);
	}

	@Post()
	@ApiOperation({ summary: "Create a Rule" })
	async create(@Body() ruleLogsDto: RuleLogDto): Promise<RuleLog> {
		return await this.ruleLogService.create(ruleLogsDto);
	}

	@Put('/:id')
	@ApiOperation({ summary: "Update a Rule by ID" })
	async update(@Param('id') id: string, @Body() ruleLogDto: RuleLogDto): Promise<RuleLog> {
		return await this.ruleLogService.update(id, ruleLogDto);
	}

	@Delete('/:id')
	@ApiOperation({ summary: "Delete a Rule by ID" })
	async delete(@Param('id') id: string): Promise<void> {
		await this.ruleLogService.delete(id);
	}
}