import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './gateway/socket.gateway';
import { SocketService } from './services/socket.service';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from '~configs/env.config';

@Global()
@Module({
  providers: [SocketService, SocketGateway],
  imports: [
    JwtModule.register({
      secret: envConfig.JWT.SECRET,
      signOptions: {
        expiresIn: envConfig.JWT.EXPIRES_IN,
        algorithm: 'HS512',
      },
    }),
  ],
  exports: [SocketService],
})
export class SocketModule {}
