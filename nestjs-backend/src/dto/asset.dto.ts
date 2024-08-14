import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AssetType } from "../model/asset.model";


export class AssetDto {
    @IsNotEmpty()
    @IsString()
    ticker: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(AssetType)
    type: AssetType;

    @IsNotEmpty()
    @IsString()
    risk: string;

    @IsNotEmpty()
    @IsString()
    geography: string;

    @IsNotEmpty()
    @IsNumber()
    position: number;

    @IsNotEmpty()
    @IsNumber()
    last: number;

    @IsNotEmpty()
    @IsNumber()
    cost: number;
}