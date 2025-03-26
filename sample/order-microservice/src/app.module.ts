import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '~domains/orders/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './configs/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    HttpModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
