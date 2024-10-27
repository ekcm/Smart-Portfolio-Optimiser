import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class AssetPriceTestDto {
  @IsNotEmpty()
  @IsString()
  ticker: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  sector: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  todayClose: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  yesterdayClose: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}