// import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
// import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiExtraModels } from "@nestjs/swagger";
// import { RuleService } from "src/service/rule.service";
// import { CashRuleDto, RiskRuleDto, RuleDto } from "src/dto/rule.dto";
// import { Rule, RuleType } from "src/model/rule.model";

// @ApiTags("Rules")
// @Controller("rules")
// @ApiExtraModels(CashRuleDto, RiskRuleDto) // Add this to ensure Swagger includes these models
// export class RuleController {
//     constructor(private ruleService: RuleService) {}

//     @Get()
//     @ApiOperation({ summary: 'Get all rules' })
//     @ApiResponse({ 
//         status: 200, 
//         description: 'Return all rules', 
//         type: Rule,
//         isArray: true 
//     })
//     async getAllRules(): Promise<Rule[]> {
//         return this.ruleService.findAll();
//     }

//     @Get(':id')
//     @ApiOperation({ summary: 'Get rule by id' })
//     @ApiResponse({ 
//         status: 200, 
//         description: 'Return the rule', 
//         type: Rule 
//     })
//     @ApiResponse({ 
//         status: 404, 
//         description: 'Rule not found' 
//     })
//     async getRule(@Param('id') id: string): Promise<Rule> {
//         return this.ruleService.findById(id);
//     }

//     @Post()
//     @ApiOperation({ 
//         summary: 'Create a new rule',
//         description: 'Create a new rule. For MIN_CASH/MAX_CASH rules, percentage cannot exceed 100. For RISK rules, stocks + bonds must equal 100.'
//     })
//     @ApiBody({ 
//         schema: {
//             oneOf: [
//                 { $ref: '#/components/schemas/CashRuleDto' },
//                 { $ref: '#/components/schemas/RiskRuleDto' }
//             ]
//         },
//         examples: {
//             minCashRule: {
//                 summary: 'Minimum Cash Rule Example',
//                 description: 'Create a rule requiring minimum 2% cash holdings',
//                 value: {
//                     __type: 'MIN_CASH',
//                     name: 'Minimum Cash Rule',
//                     description: 'Portfolio must maintain at least 2% in cash',
//                     percentage: 2
//                 }
//             },
//             maxCashRule: {
//                 summary: 'Maximum Cash Rule Example',
//                 description: 'Create a rule limiting cash holdings to 20%',
//                 value: {
//                     __type: 'MAX_CASH',
//                     name: 'Maximum Cash Rule',
//                     description: 'Portfolio cannot exceed 20% in cash',
//                     percentage: 20
//                 }
//             },
//             riskRule: {
//                 summary: 'Risk Allocation Rule Example',
//                 description: 'Create a rule specifying 60% stocks, 40% bonds allocation',
//                 value: {
//                     __type: 'RISK',
//                     name: 'Balanced Risk Rule',
//                     description: 'Portfolio must maintain 60/40 stocks/bonds allocation',
//                     stocks: 60,
//                     bonds: 40
//                 }
//             }
//         }
//     })
//     @ApiResponse({ 
//         status: 201, 
//         description: 'Rule created successfully', 
//         type: Rule 
//     })
//     @ApiResponse({ 
//         status: 400, 
//         description: 'Invalid input' 
//     })
//     async createRule(@Body() dto: CashRuleDto | RiskRuleDto): Promise<Rule> {
//         return this.ruleService.createRule(dto);
//     }

//     @Patch(':id')
//     @ApiOperation({ summary: 'Update a rule' })
//     @ApiBody({ 
//         schema: {
//             oneOf: [
//                 { $ref: '#/components/schemas/CashRuleDto' },
//                 { $ref: '#/components/schemas/RiskRuleDto' }
//             ]
//         },
//         examples: {
//             minCashRule: {
//                 summary: 'Update Minimum Cash Rule Example',
//                 description: 'Update minimum cash requirement to 3%',
//                 value: {
//                     __type: 'MIN_CASH',
//                     name: 'Updated Minimum Cash Rule',
//                     description: 'Portfolio must maintain at least 3% in cash',
//                     percentage: 3
//                 }
//             }
//         }
//     })
//     @ApiResponse({ 
//         status: 200, 
//         description: 'Rule updated successfully', 
//         type: Rule 
//     })
//     @ApiResponse({ 
//         status: 404, 
//         description: 'Rule not found' 
//     })
//     async updateRule(
//         @Param('id') id: string,
//         @Body() dto: CashRuleDto | RiskRuleDto
//     ): Promise<Rule> {
//         return this.ruleService.updateRule(id, dto);
//     }

//     @Delete(':id')
//     @ApiOperation({ summary: 'Delete a rule' })
//     @ApiResponse({ 
//         status: 200, 
//         description: 'Rule deleted successfully' 
//     })
//     @ApiResponse({ 
//         status: 404, 
//         description: 'Rule not found' 
//     })
//     async deleteRule(@Param('id') id: string): Promise<void> {
//         return this.ruleService.deleteRule(id);
//     }
// }
