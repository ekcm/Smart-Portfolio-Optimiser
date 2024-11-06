import { Module } from "@nestjs/common";
import { RuleHandlerController } from "src/controller/ruleHandler.controller";
import { RuleHandlerService } from "src/service/ruleHandler.service";
import { RuleLogModule } from "./ruleLog.module";
import { PortfolioModule } from "./portfolio.module";

@Module({
    imports: [RuleLogModule, PortfolioModule],
    controllers: [RuleHandlerController],
    providers: [RuleHandlerService],
    exports: [RuleHandlerService]
})

export class RuleHandlerModule {}