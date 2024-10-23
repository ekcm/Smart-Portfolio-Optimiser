import { Module } from "@nestjs/common";
import { RuleValidatorController } from "../controller/ruleValidator.controller";
import { RuleValidatorService } from "../service/ruleValidator.service";

@Module({
    controllers: [RuleValidatorController],
    providers: [RuleValidatorService],
    exports: [RuleValidatorService],
})
export class RuleValidatorModule {}