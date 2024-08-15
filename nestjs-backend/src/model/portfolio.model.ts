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

  @Prop({ unique: true })
  portfolioId: string;

  @Prop()
  portfolioClient: string;

  @Prop()
  portfolioName: string;

  @Prop({ enum: RiskAppetite })
  clientRiskAppetite: RiskAppetite;

  @Prop({ type: Number })
  portfolioCashAmount: number;

  @Prop({ type: [{ type: AssetHolding }], default: [] })
  assetHoldings: AssetHolding[]
}

// missing securitiesList and transactionsList

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)