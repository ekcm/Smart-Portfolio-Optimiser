import { Order } from "src/model/order.model";
import { OrderDto } from '../dto/order.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

    async getAll(): Promise<Order[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.orderModel.find().exec());
            }, 1000);
        });
    }

    async getByPortfolioId(portfolioId: string): Promise<Order[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const ordersByPortfolioId = await this.orderModel.find({ portfolioId }).exec();
                resolve(ordersByPortfolioId)
            }, 1000);
        });
    }

    async create(orderDto: OrderDto): Promise<Order> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const createdOrder = new this.orderModel(orderDto);
                resolve(await createdOrder.save());
            }, 1000);
        })
    }

    async update(id: string, orderDto: OrderDto): Promise<Order> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const existingOrder = await this.orderModel.findByIdAndUpdate(
                    id,
                    orderDto,
                    { new: true }
                );
                if (!existingOrder) {
                    reject(new NotFoundException('Order #${id} not found'));
                } else {
                    resolve(existingOrder)
                }
            }, 1000)
        })
    }

    async delete(id: string): Promise<Order> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const order = await this.orderModel.findByIdAndDelete(id);
                if (!order) {
                    reject(new NotFoundException('Order #${id} not found'));
                } else {
                    resolve(order);
                }
            }, 1000)
        })
    }
}