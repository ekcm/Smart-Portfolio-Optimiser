import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AssetPriceTestService } from '../service/assetpricetest.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PortfolioGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private isAcknowledged = false;

  constructor(private readonly assetPriceTestService: AssetPriceTestService) {}
  
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToPortfolioUpdates')
  handleSubscribeToPortfolio(@ConnectedSocket() client: Socket, @MessageBody() portfolioId: string) {
    client.join(portfolioId); 
    console.log(`Client ${client.id} subscribed to portfolio ${portfolioId}`);
  }

  @SubscribeMessage('unsubscribeFromPortfolioUpdates')
  handleUnsubscribeFromPortfolio(@ConnectedSocket() client: Socket, @MessageBody() portfolioId: string) {
    client.leave(portfolioId); 
    console.log(`Client ${client.id} unsubscribed from portfolio ${portfolioId}`);
  }

  @SubscribeMessage('acknowledgeBatch')
  async handleAcknowledgement(@ConnectedSocket() client: Socket) {

    if (!this.isAcknowledged) {
      this.isAcknowledged = true;
  
      console.log('Acknowledgment received. Triggering batch insertion.');
  
      await this.assetPriceTestService.acknowledgeBatch();
  
      setTimeout(() => {
        this.isAcknowledged = false;
      }, 5000); 
    } else {
      console.log('Acknowledgment received but ignored due to ongoing batch process.');
    }
  }
  
  @SubscribeMessage('triggerBatch')
  async handleTriggerBatch(@ConnectedSocket() client: Socket) {
    console.log(`Client ${client.id} requested batch process`);

    try {
      await this.assetPriceTestService.processNextBatch();
      console.log('Batch process triggered manually by client');
    } catch (error) {
      console.error('Error during manual batch processing:', error);
    }
  }
  
  broadcastPortfolioUpdate(portfolioId: string) {
    this.server.to(portfolioId).emit('portfolioUpdate'); 
    console.log(`Notified portfolio ${portfolioId} clients of an update`);
  }
}