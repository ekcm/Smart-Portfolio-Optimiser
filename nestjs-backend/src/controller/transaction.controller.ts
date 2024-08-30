import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransactionService } from '../service/transaction.service';
import { Order } from "src/model/order.model";
import { OrderDto } from "src/dto/order.dto";

@ApiTags('Transaction Service')
@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Post('/order')
    @ApiOperation({summary: 'Place an order'})
    async placeOrder(@Body() orderDto: OrderDto): Promise<Order> {
        return this.transactionService.placeOrder(orderDto)
    }
}
