import { Controller, Post, Body } from "@nestjs/common";
import { RuleValidatorService } from "../service/ruleValidator.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Rule Validator Service")
@Controller("rule-validator")
export class RuleValidatorController {
    constructor(private readonly ruleValidatorService: RuleValidatorService) {}

    // @Post("/check-portfolio")
    // @ApiOperation({ summary: "Check rules when loading portfolio" })
    // async checkPortfolio(@Body() body: any): Promise<any> {
    //     return await this.ruleValidatorService.checkPortfolio(body);
    // }

    // @Post("/check-add-stock")
    // @ApiOperation({ summary: "Check rules when adding stock to cart" })
    // async checkAddStock(@Body() body: any): Promise<any> {
    //     return await this.ruleValidatorService.checkAddStock(body);
    // }

    // @Post("/check-optimise-portfolio")
    // @ApiOperation({ summary: "Check rules when optimising portfolio" })
    // async checkOptimisePortfolio(@Body() body: any): Promise<any> {
    //     return await this.ruleValidatorService.checkOptimisePortfolio(body);
    // }

    // @Post("/check-stock-update")
    // @ApiOperation({ summary: "Check rules when stock prices are updated" })
    // async checkStockUpdate(@Body() body: any): Promise<any> {
    //     return await this.ruleValidatorService.checkStockUpdate(body);
    // }

    // @Post("/check-home-dashboard")
    // @ApiOperation({ summary: "Check rules when loading home dashboard" })
    // async checkHomeDashboard(@Body() body: any): Promise<any> {
    //     return await this.ruleValidatorService.checkHomeDashboard(body);
    // }

    // @Post("/check-add-cash")
    // @ApiOperation({ summary: "Check rules when adding cash" })
    // async checkAddCash(@Body() body: any): Promise<any> {
    //     return await this.ruleValidatorService.checkAddCash(body);
    // }

    // @Post("/check-modify-portfolio")
    // @ApiOperation({ summary: "Check rules when modifying portfolio" })
    // async checkModifyPortfolio(@Body() body: any): Promise<any> {
    //     return await this.ruleValidatorService.checkModifyPortfolio(body);
    // }
}
