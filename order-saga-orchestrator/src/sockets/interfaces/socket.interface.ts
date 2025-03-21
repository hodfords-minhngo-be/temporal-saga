import { Socket } from 'socket.io';

export interface SocketInterface extends Socket {
  user: {
    id: string;
  };
}
