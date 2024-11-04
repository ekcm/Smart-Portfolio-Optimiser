import { Module } from "@nestjs/common";
import { RuleHandlerController } from "src/controller/ruleHandler.controller";
import { RuleHandlerService } from "src/service/ruleHandler.service";
import { RuleLogModule } from "./ruleLog.module";

@Module({
    imports: [RuleLogModule],
    controllers: [RuleHandlerController],
    providers: [RuleHandlerService],
    exports: [RuleHandlerService]
})

export class RuleHandlerModule {}