import { IsNotEmpty, IsString, IsNumber, IsEnum } from "class-validator";
import { AssetType } from "../model/asset.model";

// TODO
// do same as model
export class AssetDto {
    @IsNotEmpty()
    @IsString()
    assetTicker: string;

    @IsNotEmpty()
    @IsString()
    assetName: string;

    @IsNotEmpty()
    @IsEnum(AssetType)
    assetType: AssetType;

    @IsNotEmpty()
    @IsString()
    assetRisk: string;

    @IsNotEmpty()
    @IsString()
    assetGeography: string;

    @IsNotEmpty()
    @IsNumber()
    assetPosition: number;

    @IsNotEmpty()
    @IsNumber()
    assetLast: number;

    @IsNotEmpty()
    @IsNumber()
    assetCost: number;
}