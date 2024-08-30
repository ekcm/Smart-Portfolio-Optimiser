import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AssetType {
    STOCK = 'STOCK',
    BOND = 'BOND',
}

@Schema({ collection: 'Asset' })
export class Asset extends Document {
    @Prop()
    ticker: string;

    @Prop()
    name: string;

    @Prop({ enum: AssetType })
    type: string;

    @Prop()
    geography: string;

    @Prop()
    industry: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
