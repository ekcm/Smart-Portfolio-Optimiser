import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'FinanceNews' })
export class FinanceNews extends Document {
    @Prop({ required: true })
    stock: string;

    @Prop({ required: true, type: Date })
    date: Date;

    @Prop({ required: true, type: Number })
    sentimentRating: number;

    @Prop({ required: true, type: Map })
    financeNews: Map<any, any>;

}

export const FinanceNewsSchema = SchemaFactory.createForClass(FinanceNews);
