import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RuleDto } from "../dto/rule.dto";
import { Rule } from "../model/rule.model";
import { RuleService } from "../service/rule.service";

@ApiTags("Rule Service")
@Controller("rule")
export class RuleController {
	constructor(private readonly ruleService: RuleService) {}

	@Get()
	@ApiOperation({ summary: "Get all Rules" })
	async getAll(): Promise<Rule[]> {
		return await this.ruleService.getAll();
	}

	@Get('/:id')
	@ApiOperation({ summary: "Get one Rule by ID" })
	async getById(@Param('id') id: string): Promise<Rule> {
		return await this.ruleService.getById(id);
	}

	@Post()
	@ApiOperation({ summary: "Create a Rule" })
	async create(@Body() rulesDto: RuleDto): Promise<Rule> {
		return await this.ruleService.create(rulesDto);
	}

	@Put('/:id')
	@ApiOperation({ summary: "Update a Rule by ID" })
	async update(@Param('id') id: string, @Body() rulesDto: RuleDto): Promise<Rule> {
		return await this.ruleService.update(id, rulesDto);
	}

	@Delete('/:id')
	@ApiOperation({ summary: "Delete a Rule by ID" })
	async delete(@Param('id') id: string): Promise<void> {
		await this.ruleService.delete(id);
	}
}