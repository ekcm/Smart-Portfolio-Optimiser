import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

export enum AssetType {
    STOCK = 'STOCK',
    BOND = 'BOND',
}


@Schema()
export class Asset extends Document{

    @Prop()
    assetTicker: string;

    @Prop()
    assetName: string;

    @Prop({ enum: AssetType })
    assetType: string;

    @Prop()
    assetRisk: string;

    @Prop()
    assetGeography: string;

    @Prop({ type: Number })
    assetPosition: number;

    @Prop({ type: Number })
    assetLast: number;

    @Prop({ type: Number })
    assetCost: number;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);