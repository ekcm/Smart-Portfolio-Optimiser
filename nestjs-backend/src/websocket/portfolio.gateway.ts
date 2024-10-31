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
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class PortfolioGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer() server: Server;
  
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
      console.log("Client object:", client);
      client.join(portfolioId); 
      console.log(`Client ${client.id} subscribed to portfolio ${portfolioId}`);
    }
  
    @SubscribeMessage('unsubscribeFromPortfolioUpdates')
    handleUnsubscribeFromPortfolio(@ConnectedSocket() client: Socket, @MessageBody() portfolioId: string) {
      client.leave(portfolioId); 
      console.log(`Client ${client.id} unsubscribed from portfolio ${portfolioId}`);
    }
  
    broadcastPortfolioUpdate(portfolioId: string) {
        this.server.to(portfolioId).emit('portfolioUpdate'); 
        console.log(`Notified portfolio ${portfolioId} clients of an update`);
    }
  }  