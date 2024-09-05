import { Prop, Schema } from "@nestjs/mongoose";
import { Type } from "class-transformer";

@Schema({ collection: 'AssetHolding' })
export class AssetHolding {
    @Prop({ required: true })
    ticker: string;

    @Prop({ required: true, type: Number })
    @Type(() => Number)
    cost: number

    @Prop({ required: true })
    @Type(() => Number)
    quantity: number;

    @Prop({ required: true })
    assetType: string;
}