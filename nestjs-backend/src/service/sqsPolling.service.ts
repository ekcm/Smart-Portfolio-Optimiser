import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { OrderFulfilmentService } from './orderFulfilment.service';

@Injectable()
export class SqsPollingService implements OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout;

  constructor(
    private readonly sqsService: SqsService,
    private readonly orderFulfilmentService: OrderFulfilmentService,
  ) {}

  onModuleInit() {
    this.startPolling();
  }

  onModuleDestroy() {
    clearInterval(this.intervalId);
  }

  private startPolling() {
    this.intervalId = setInterval(async () => {
      console.log('Polling SQS for messages...');
      const message = await this.sqsService.receiveMessage();

      if (message) {
        console.log('Message received:', message.Body);
        await this.orderFulfilmentService.handlePriceUpdate(message);

        await this.sqsService.deleteMessage(message.ReceiptHandle);
        console.log('Message processed and deleted from SQS.');
      }
    }, 15000); 
  }
}