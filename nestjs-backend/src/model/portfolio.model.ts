import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { OrderSchema } from './order.model';
import { PortfolioService } from '../service/portfolio.service';

export enum RiskAppetite {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Schema()
export class Portfolio extends Document{

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
}

// missing securitiesList and transactionsList

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)