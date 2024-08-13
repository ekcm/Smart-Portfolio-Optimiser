import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL'
}

@Schema()
export class Order extends Document{

    @Prop({ enum: OrderType })
    orderType: OrderType;

    @Prop({ type: Date })
    orderDate: Date;

    @Prop()
    assetName: string;

    @Prop({ type: Number })
    quantity: number;
    
    @Prop({ type: Number })
    price: number;
    
    @Prop()
    portfolioId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);