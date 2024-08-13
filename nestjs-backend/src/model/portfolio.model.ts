import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

export enum RiskAppetite {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Schema()
export class Portfolio extends Document {

  @Prop()
  portfolioId: string;

  @Prop()
  portfolioClient: string;

  @Prop()
  portfolioName: string;
  
  @Prop({ enum: RiskAppetite })
  clientRiskAppetite: RiskAppetite;

  @Prop({ type: Number })
  portfolioCashAmount: number;
}


export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

// missing securitiesList and transactionsList