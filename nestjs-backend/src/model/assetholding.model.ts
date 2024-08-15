import { Prop, Schema } from "@nestjs/mongoose";
import { Type } from "class-transformer";

@Schema()
export class AssetHolding {
    @Prop({ required: true })
    ticker: string;

    @Prop({ required: true })
    @Type(() => Number)
    cost: number

    @Prop({ required: true })
    @Type(() => Number)
    quantity: string;
}