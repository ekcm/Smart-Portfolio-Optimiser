import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ReportService } from "src/service/report.service";
import { PortfolioReport } from "src/types";

@ApiTags("Report Service")
@Controller("report")
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Get('/:id')
	@ApiOperation({ summary: "Get breakdown of portfolio by ID" })
	 @ApiParam({
        name: "id",
        description: "Portfolio Id of portfolio",
        required: true,
        example: "66d9ae695e15ad24b5e2053a",
    })
	async getById(@Param('id') id: string): Promise<PortfolioReport> {
		return await this.reportService.generateReport(id);
	}

	@Get('/order/date')
	@ApiOperation({ summary: "Get order execution by portfolio ID and date range" })
	@ApiQuery({
		name: 'id',
		required: true,
		description: 'Portfolio Id of portfolio',
		example: "66d9ae695e15ad24b5e2053a",
	})
	@ApiQuery({
        name: 'startDate',
        required: true,
        description: 'The start date of the date range for the report (format: yyyy-mm-dd)',
        example: "2024-01-01",
    })
    @ApiQuery({
        name: 'endDate',
        required: true,
        description: 'The end date of the date range for the report (format: yyyy-mm-dd)',
        example: "2024-12-31",
    })
	async getOrderExecution(@Query('id') id: string, @Query('startDate') startDate: Date, @Query('endDate') endDate: Date) {
		return await this.reportService.generateOrderExecution(id, startDate, endDate);
	}
}