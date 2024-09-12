import { Type } from "class-transformer";
import { OrderStatus, OrderType } from "../model/order.model";
import { IsEnum, IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from "class-validator";

export class OrderDto{
    @IsNotEmpty()
    @IsEnum(OrderType)
    orderType: OrderType;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    orderDate: Date = new Date();

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

    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus = OrderStatus.PENDING;
  }