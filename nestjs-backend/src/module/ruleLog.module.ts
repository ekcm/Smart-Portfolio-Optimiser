import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleLogController } from '../controller/ruleLog.controller';
import { RuleLogService } from '../service/ruleLog.service';
import { RuleLog, RuleLogSchema } from '../model/ruleLog.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: RuleLog.name, schema: RuleLogSchema }])
    ],
    controllers: [RuleLogController],
    providers: [RuleLogService],
    exports: [RuleLogService]
})
export class RuleLogModule { }