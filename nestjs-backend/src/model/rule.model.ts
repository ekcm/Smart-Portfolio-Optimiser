import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RuleType {
    CASH = 'CASH',
    RISK = 'RISK'
}

@Schema({ collection: "Rule"})
export class Rule extends Document {
    @Prop()
    type: string;

    @Prop()
    threshold: number;

    @Prop()
    name: string;

    @Prop()
    description: string;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);