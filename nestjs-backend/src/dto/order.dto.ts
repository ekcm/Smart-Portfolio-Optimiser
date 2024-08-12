import { OrderType } from "../model/order.model";
import { IsEnum, IsNotEmpty, IsString, IsNumber, IsDate } from "class-validator";

export class OrderDto{
    @IsNotEmpty()
    @IsEnum(OrderType)
    orderType: OrderType;

    @IsNotEmpty()
    @IsDate()
    orderDate: Date;

    @IsNotEmpty()
    @IsString()
    assetName: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;
  }