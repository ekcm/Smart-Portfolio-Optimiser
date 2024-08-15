import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common/decorators";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderDto } from "src/dto/order.dto";
import { OrderService } from "src/service/order.service";

@ApiTags("Order Service")
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @ApiOperation({ summary: "Create an Order" })
    create(@Body() orderDto: OrderDto) {
        return this.orderService.create(orderDto);
    }

    @Get()
    @ApiOperation({ summary: "Get all Orders" })
    getAll() {
        return this.orderService.getAll();
    }

    @Get(':portfolioId')
    @ApiOperation({ summary: "Get all Orders belonging to Portfolio with particular ID" })
    findById(@Param('portfolioId') portfolioId: string) {
        return this.orderService.getByPortfolioId(portfolioId);
    }

    @Put(':id')
    @ApiOperation({ summary: "Update Order with ID" })
    update(@Param('id') id: string, @Body() orderDto: OrderDto) {
        return this.orderService.update(id, orderDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: "Delete Order with ID" })
    delete(@Param('id') id: string) {
        return this.orderService.delete(id);
    }
}
