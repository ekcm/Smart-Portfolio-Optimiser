import { Module } from "@nestjs/common";
import { RuleController } from "src/controller/rule.controller";
import { RuleService } from "src/service/rule.service";
import { RuleLogModule } from "./ruleLog.module";
import { PortfolioModule } from "./portfolio.module";

@Module({
    imports: [RuleLogModule, PortfolioModule],
    controllers: [RuleController],
    providers: [RuleService],
    exports: [RuleService]
})

export class RuleModule {}