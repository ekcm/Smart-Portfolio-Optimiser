import { Prop, Schema, SchemaFactory, Index } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
@Index({ ticker: 1, date: 1 }, { unique: true })  // Composite unique index on ticker and date
export class AssetPrice extends Document {
  
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

export const AssetPriceSchema = SchemaFactory.createForClass(AssetPrice);