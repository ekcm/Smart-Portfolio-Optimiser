import { Module } from "@nestjs/common";
import { RuleHandlerController } from "src/controller/ruleHandler.controller";
import { RuleHandlerService } from "src/service/ruleHandler.service";
import { PortfolioModule } from "./portfolio.module";
import { RuleModule } from "./rule.module";

@Module({
    imports: [RuleModule, PortfolioModule],
    controllers: [RuleHandlerController],
    providers: [RuleHandlerService],
    exports: [RuleHandlerService]
})

export class RuleHandlerModule {}