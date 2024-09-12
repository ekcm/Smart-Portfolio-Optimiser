import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum OrderStatus {
    FILLED = 'FILLED',
    PENDING = 'PENDING'
}

@Schema({ collection: 'Order' })
export class Order extends Document {
    @Prop({ enum: OrderType })
    orderType: OrderType;

    @Prop({ type: Date, default: new Date()})
    orderDate: Date;

    @Prop()
    assetName: string;

    @Prop({ type: Number })
    quantity: number;

    @Prop({ type: Number })
    price: number;

    @Prop()
    portfolioId: string;

    @Prop({ enum: OrderStatus, default: OrderStatus.PENDING})
    orderStatus: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
