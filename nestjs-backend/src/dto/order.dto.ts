import { Type } from "class-transformer";
import { OrderStatus, OrderType } from "../model/order.model";
import { IsEnum, IsNotEmpty, IsString, IsNumber, IsDate } from "class-validator";

export class OrderDto{
    @IsNotEmpty()
    @IsEnum(OrderType)
    orderType: OrderType;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    orderDate: Date;

    @IsNotEmpty()
    @IsString()
    assetName: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price: number;

    @IsNotEmpty()
    @IsString()
    portfolioId: string;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;
  }