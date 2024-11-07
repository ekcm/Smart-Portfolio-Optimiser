import { Controller, Post, Body } from "@nestjs/common";
import { RuleValidatorService } from "../service/ruleValidator.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Rule Validator Service")
@Controller("rule-validator")
export class RuleValidatorController {
    constructor(private readonly ruleValidatorService: RuleValidatorService) {}
    
}
