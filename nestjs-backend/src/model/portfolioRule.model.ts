import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ collection: 'PortfolioRule' })
export class PortfolioRule extends Document {
    @Prop({ required: true })
    portfolioId: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rules' }] })
    rules: ObjectId[];
}

export const PortfolioRuleSchema = SchemaFactory.createForClass(PortfolioRule);