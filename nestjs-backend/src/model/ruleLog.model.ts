import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'RuleLog' })
export class RuleLog extends Document {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true, type: Number })
    version: number;
    
    @Prop({ required: true, type: Date })
    timestamp: Date;

    @Prop()
    changeMessage: string;
}


export const RuleLogSchema = SchemaFactory.createForClass(RuleLog);