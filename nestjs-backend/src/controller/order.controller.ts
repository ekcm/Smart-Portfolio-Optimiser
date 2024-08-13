import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common/decorators";
import { OrderDto } from "src/dto/order.dto";
import { OrderService } from "src/service/order.service";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    create(@Body() orderDto: OrderDto) {
        return this.orderService.create(orderDto);
    }

    @Get()
    getAll() {
        return this.orderService.getAll();
    }

    @Get(':portfolioId')
    findById(@Param('portfolioId') portfolioId: string) {
        return this.orderService.getByPortfolioId(portfolioId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() orderDto: OrderDto) {
        return this.orderService.update(id, orderDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.orderService.delete(id);
    }
}
