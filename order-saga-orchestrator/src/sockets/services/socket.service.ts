import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class SocketService {
  @WebSocketServer() server: Server;

  emit<T>(event: string, data: T): void {
    this.server.emit(event, data);
  }

  emitRoom<T = any>(room: string | string[], event: string, data?: T): void {
    if (!this.server) {
      return;
    }
    this.server.to(room).emit(event, data);
  }
}
