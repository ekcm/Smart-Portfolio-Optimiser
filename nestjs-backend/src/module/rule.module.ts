import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleController } from '../controller/rule.controller';
import { RuleService } from '../service/rule.service';
import { Rule, RuleSchema } from '../model/rule.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Rule.name, schema: RuleSchema }])
    ],
    controllers: [RuleController],
    providers: [RuleService],
    exports: [RuleService]
})
export class RuleModule { }