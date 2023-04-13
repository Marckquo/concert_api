import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CreationResult } from 'src/tezos/creation-result.type';
import { Server } from 'ws';

interface WsCreationResult {
  showId: string,
  address?: string
}

@WebSocketGateway({
  transports: ['websocket']
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(_client: any, ..._args: any[]) {}
  handleDisconnect(_client: any) {}

  @SubscribeMessage('result')
  handleEvent(@MessageBody() data: any): string {
    return 'Hello world!';
  }

  private broadcast(result: WsCreationResult){
    this.server.clients.forEach(client => {
      client.send(JSON.stringify({ event: 'result', data: result }));
    });
  }

  public publishCreationResult(creationResult: CreationResult){
    this.broadcast({
      showId: creationResult.showId,
      address: creationResult.created ? creationResult.address : null
    });
  }
}
