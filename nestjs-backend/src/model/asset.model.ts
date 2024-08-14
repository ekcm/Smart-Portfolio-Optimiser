import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AssetType {
    STOCK = 'STOCK',
    BOND = 'BOND',
}

@Schema()
export class Asset extends Document {
    @Prop()
    ticker: string;

    @Prop()
    name: string;

    @Prop({ enum: AssetType })
    type: string;

    @Prop()
    geography: string;

    @Prop({ type: Number })
    position: number;

    @Prop({ type: Number })
    last: number;

    @Prop({ type: Number })
    cost: number;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
