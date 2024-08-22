import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CoreService, DashboardCard } from "src/service/core.service";

@ApiTags("Core Service")
@Controller("core")
export class CoreController {
    constructor(private coreService: CoreService) { }

    @Get()
    @ApiOperation({ summary: "Get all Portfolios by Manager" })
    async getAll(): Promise<DashboardCard[]> {
      return await this.coreService.loadHomepage();
    }

}