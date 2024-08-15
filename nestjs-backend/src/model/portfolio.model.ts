import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AssetHolding } from "./assetholding.model";

export enum RiskAppetite {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Schema()
export class Portfolio extends Document {
  @Prop()
  client: string;

  @Prop()
  portfolioName: string;

  @Prop({ enum: RiskAppetite })
  riskAppetite: RiskAppetite;

  @Prop({ type: Number })
  cashAmount: number;

  @Prop({ type: [{ type: AssetHolding }], default: [] })
  assetHoldings: AssetHolding[]
}

// missing and transactionsList

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)