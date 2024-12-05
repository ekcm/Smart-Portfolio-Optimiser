import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common/decorators";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderDto } from "src/dto/order.dto";
import { OrderService } from "src/service/order.service";

@ApiTags("Order Service")
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @ApiOperation({ summary: "Create an Order" })
    @ApiBody({
        description: 'The order data to create a new order',
        type: OrderDto,
    })
    @ApiResponse({
        status: 201,
        description: 'The order has been successfully created',
        type: OrderDto,  // Document the expected response schema
    })
    create(@Body() orderDto: OrderDto) {
        return this.orderService.create(orderDto);
    }

    @Get()
    @ApiOperation({ summary: "Get all Orders" })
    @ApiResponse({
        status: 200,
        description: 'List of all orders',
        type: [OrderDto],
    })
    getAll() {
        return this.orderService.getAll();
    }

    @Get(':portfolioId')
    @ApiOperation({ summary: "Get all Orders belonging to Portfolio with particular ID" })
    @ApiParam({
        name: 'portfolioId',
        description: 'ID of the portfolio for which orders are being fetched',
        required: true,
        example: '66ef29f6d094c73406fa5ea2',
    })
    @ApiResponse({
        status: 200,
        description: 'List of orders belonging to the specified portfolio',
        type: [OrderDto],
    })
    findById(@Param('portfolioId') portfolioId: string) {
        return this.orderService.getByPortfolioId(portfolioId);
    }

    @Put(':id')
    @ApiOperation({ summary: "Update Order with ID" })
    @ApiParam({
        name: 'id',
        description: 'ID of the order to update',
        required: true,
        example: '66ef29f6d094c73406fa5ea2',
    })
    @ApiBody({
        description: 'The order data to update the existing order',
        type: OrderDto,
    })
    @ApiResponse({
        status: 200,
        description: 'The order has been successfully updated',
        type: OrderDto,
    })
    update(@Param('id') id: string, @Body() orderDto: OrderDto) {
        return this.orderService.update(id, orderDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: "Delete Order with ID" })
    @ApiParam({
        name: 'id',
        description: 'ID of the order to delete',
        required: true,
        example: '66ef29f6d094c73406fa5ea2',
    })
    @ApiResponse({
        status: 200,
        description: 'The order has been successfully deleted',
    })
    delete(@Param('id') id: string) {
        return this.orderService.delete(id);
    }
}
