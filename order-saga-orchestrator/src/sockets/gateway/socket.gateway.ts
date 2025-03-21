import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from '~domains/auth/guards/ws-auth.guard';
import { SocketInterface } from '~sockets/interfaces/socket.interface';
import { SocketService } from '~sockets/services/socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('SocketGateway');

  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  async handleDisconnect(client: SocketInterface): Promise<void> {
    if (!client.user) {
      this.logger.debug(`Unauthorized client disconnected: ${client.id}`);
      return;
    }
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: SocketInterface): void {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  afterInit(server: any) {
    this.socketService.server = server;
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('JOIN_ROOM')
  async handleJoinRoom(@ConnectedSocket() client: SocketInterface) {
    client.join('youtube-sharing-room');

    client.emit('JOINED_ROOM', 'You have joined the room');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('LEAVE_ROOM')
  async handleLeaveRoom(@ConnectedSocket() client: SocketInterface) {
    await client.leave('youtube-sharing-room');

    client.emit('LEFT_ROOM', 'You have left the room');
  }
}
