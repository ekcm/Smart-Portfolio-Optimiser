import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GeneratedSummary } from 'src/types';


@Schema({ collection: 'FinanceNews' })
export class FinanceNews extends Document {
    @Prop({ required: true })
    ticker: string;

    @Prop({ required: true, type: Date })
    date: Date;

    @Prop({ required: true, type: Number })
    sentimentRating: number;

    @Prop({ required: true, type: Array })
    summary: GeneratedSummary[];

    @Prop({ required: true, type: Array })
    references: string[];

}

export const FinanceNewsSchema = SchemaFactory.createForClass(FinanceNews);
