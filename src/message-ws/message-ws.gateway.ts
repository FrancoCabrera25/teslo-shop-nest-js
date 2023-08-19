import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-form-client')
  hanldeMessageFromClient(client: Socket, payload: NewMessageDto) {
    //emite al client
    // client.emit('message-form-server', {
    //   fullName: 'franco',
    //   message: payload.message || 'no message!!',
    // });

    //emitir a todos menos al cliente inicial.
    // client.broadcast.emit('message-form-server', {
    //   fullName: 'franco',
    //   message: payload.message || 'no message!!',
    // });

    //emite a todos
    this.wss.emit('message-form-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no message!!',
    });
  }
}
