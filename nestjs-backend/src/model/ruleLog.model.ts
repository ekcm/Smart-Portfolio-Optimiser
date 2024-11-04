import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RuleType } from './rule.model';
import { IsEnum } from 'class-validator';

@Schema({ collection: 'RuleLog' })
export class RuleLog extends Document {

    @Prop()
    description: string;

    @Prop()
    portfolioId: string | null;

    @Prop()
    @IsEnum(RuleType)
    ruleType: RuleType;

    @Prop({ required: true, type: Date })
    timestamp: Date;

    @Prop()
    changeMessage: string;
}

export const RuleLogSchema = SchemaFactory.createForClass(RuleLog);
