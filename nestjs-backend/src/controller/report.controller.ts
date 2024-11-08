
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReportService } from "src/service/report.service";
import { PortfolioReport } from "src/types";

@ApiTags("Report Service")
@Controller("report")
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Get('/:id')
	@ApiOperation({ summary: "Get breakdown of portfolio by ID" })
	async getById(@Param('id') id: string): Promise<PortfolioReport> {
		return await this.reportService.generateReport(id);
	}
}