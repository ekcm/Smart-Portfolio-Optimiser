import { Body, Controller, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransactionService } from '../service/transaction.service';
import { Order } from "src/model/order.model";
import { OrderDto } from "src/dto/order.dto";

@ApiTags('Transaction Service')
@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Post('/order')
    @ApiOperation({ summary: 'Place an order' })
    @ApiBody({
        type: OrderDto,
        description: 'Order to be created',
        examples: {
            default: {
                summary: 'Example order',
                value: {
                    orderType: 'BUY',
                    assetName: 'AAPL',
                    quantity: 1,
                    price: 300,
                    portfolioId: '66d9ae695e15ad24b5e2053a',
                }

            }
        }
    })
    async placeOrder(@Body() orderDto: OrderDto): Promise<Order> {
        return await this.transactionService.placeOrder(orderDto)
    }

    @Post('/orders')
    @ApiOperation({ summary: 'Place multiple orders' })
    @ApiBody({
        type: [OrderDto],
        description: 'Array of orders to be created',
        examples: {
            default: {
                summary: 'Example array',
                value: [
                    {
                        orderType: 'BUY',
                        assetName: 'AAPL',
                        quantity: 1,
                        price: 300,
                        portfolioId: '66d9ae695e15ad24b5e2053a',
                    }
                ]
            }
        }
    })
    async placeOrders(@Body() orders: OrderDto[], @Query('portfolioId') portfolioId: string) {
        return await this.transactionService.placeOrders(orders, portfolioId)
    }
}
