import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AssetHoldingDto {
    @IsNotEmpty()
    @IsString()
    ticker: string;

    @IsNotEmpty()
    @IsNumber()
    cost: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    assetType: string;
}