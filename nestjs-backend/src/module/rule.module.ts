// import { Module } from "@nestjs/common";
// import { RuleController } from "src/controller/rule.controller";
// import { RuleService } from "src/service/rule.service";
// import { RuleLogModule } from "./ruleLog.module";
// import { PortfolioModule } from "./portfolio.module";
// import { MongooseModule } from "@nestjs/mongoose";
// import { Rule, RuleSchema } from "src/model/rule.model";

// @Module({
//     imports: [MongooseModule.forFeature([
//         { name: Rule.name, schema: RuleSchema}
//     ]), RuleLogModule, PortfolioModule],
//     controllers: [RuleController],
//     providers: [RuleService],
//     exports: [RuleService]
// })

// export class RuleModule { }