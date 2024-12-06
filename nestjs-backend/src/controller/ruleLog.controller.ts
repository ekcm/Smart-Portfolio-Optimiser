import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RuleLogDto } from "../dto/ruleLog.dto";
import { RuleLog } from "../model/ruleLog.model";
import { RuleLogService } from "../service/ruleLog.service";

@ApiTags("Rule Log Service")
@Controller("ruleLog")
export class RuleLogController {
	constructor(private readonly ruleLogService: RuleLogService) {}

	@Get()
	@ApiOperation({ summary: "Get all Rules" })
	@ApiResponse({
        status: 200,
        description: "Successfully retrieved all rule logs",
        type: RuleLog,
        isArray: true
    })
	async getAll(): Promise<RuleLog[]> {
		return await this.ruleLogService.getAll();
	}

	@Get('/:id')
	@ApiOperation({ summary: "Get one Rule Log by ID" })
	@ApiParam({
        name: "id",
        description: "ID of the Rule Log",
        required: true,
        example: "60b8d7d0f4f1a53b19f7c4f9"
    })
    @ApiResponse({
        status: 200,
        description: "Successfully retrieved the rule log",
        type: RuleLogDto
    })
    @ApiResponse({
        status: 404,
        description: "Rule log not found"
    })
	async getById(@Param('id') id: string): Promise<RuleLog> {
		return await this.ruleLogService.getById(id);
	}

	@Post()
	@ApiOperation({ summary: "Create a Rule" })
	@ApiBody({
        description: "Data to create a new Rule Log",
        type: RuleLogDto
    })
    @ApiResponse({
        status: 201,
        description: "Successfully created the rule log",
        type: RuleLogDto
    })
	async create(@Body() ruleLogsDto: RuleLogDto): Promise<RuleLog> {
		return await this.ruleLogService.create(ruleLogsDto);
	}

	@Put('/:id')
	@ApiOperation({ summary: "Update a Rule by ID" })
	@ApiParam({
        name: "id",
        description: "ID of the Rule Log to be updated",
        required: true,
        example: "60b8d7d0f4f1a53b19f7c4f9"
    })
    @ApiBody({
        description: "Data to update the Rule Log",
        type: RuleLogDto
    })
    @ApiResponse({
        status: 200,
        description: "Successfully updated the rule log",
        type: RuleLogDto
    })
    @ApiResponse({
        status: 404,
        description: "Rule log not found"
    })
	async update(@Param('id') id: string, @Body() ruleLogDto: RuleLogDto): Promise<RuleLog> {
		return await this.ruleLogService.update(id, ruleLogDto);
	}

	@Delete('/:id')
	@ApiOperation({ summary: "Delete a Rule by ID" })
	@ApiParam({
        name: "id",
        description: "ID of the Rule Log to be deleted",
        required: true,
        example: "60b8d7d0f4f1a53b19f7c4f9"
    })
    @ApiResponse({
        status: 200,
        description: "Successfully deleted the rule log"
    })
    @ApiResponse({
        status: 404,
        description: "Rule log not found"
    })
	async delete(@Param('id') id: string): Promise<void> {
		await this.ruleLogService.delete(id);
	}
}