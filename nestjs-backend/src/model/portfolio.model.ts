import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AssetHolding } from "./assetholding.model";
import { PortfolioRules } from "src/types";

export enum RiskAppetite {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Schema({ collection: 'Portfolio' })
export class Portfolio extends Document {
  @Prop()
  client: string;

  @Prop()
  portfolioName: string;m

  @Prop({ enum: RiskAppetite })
  riskAppetite: RiskAppetite;

  @Prop({ required: true, type: Number })
  cashAmount: number;

  @Prop({ type: [{ type: AssetHolding }], default: [] })
  assetHoldings: AssetHolding[]

  @Prop()
  manager: string;

  @Prop({ type: [String], default: []})
  exclusions: string[]

  @Prop({ required: true, type: Object })
  rules: PortfolioRules;
}

// missing and transactionsList

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)