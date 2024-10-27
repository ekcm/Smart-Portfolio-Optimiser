import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'AssetPriceUpdates' })  
export class AssetPriceTest extends Document {

  @Prop({ required: true })
  ticker: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  sector: string;

  @Prop({ required: true, type: Number })
  todayClose: number;

  @Prop({ required: true, type: Number })
  yesterdayClose: number;

  @Prop({ required: true, type: Date })
  date: Date;
}

export const AssetPriceTestSchema = SchemaFactory.createForClass(AssetPriceTest);
AssetPriceTestSchema.index({ ticker: 1, date: 1 }, { unique: true });