import { Body, Controller, Param, Patch } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RuleService } from "src/service/rule.service";

@ApiTags("RuleService")
@Controller("rule")
export class RuleController {
    constructor(private ruleService: RuleService) {}

    @Patch("min-cash/:portfolioId")
    @ApiOperation({ summary: "Update Min cash" })
    @ApiBody({
        description: 'Min Cash percentage to be set',
        examples: {
            default: {
                summary: 'Example update min cash',
                value: {
                    "percentage": 0.2,
                }
            }
        }
    })
    async setMinCashAmount(@Param('portfolioId') portfolioId: string, @Body("percentage") percentage: number) {
        return await this.ruleService.setMinCashAmount(portfolioId, percentage);
    }

    @Patch("max-cash/:portfolioId")
    @ApiOperation({ summary: "Update Max cash" })
    @ApiBody({
        description: 'Max Cash percentage to be set',
        examples: {
            default: {
                summary: 'Example update max cash',
                value: {
                    "percentage": 0.5,
                }
            }
        }
    })
    async setMaxCashAmount(@Param('portfolioId') portfolioId: string, @Body("percentage") percentage: number) {
        return await this.ruleService.setMaxCashAmount(portfolioId, percentage);
    }
}