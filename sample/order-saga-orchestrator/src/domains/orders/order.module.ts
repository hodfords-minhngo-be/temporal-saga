import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OrderController } from './http/controllers/order.controller';
import { OrderActivity } from './saga/workflows/place-order/activities/place-order.activity';
import { OrderMicroservice } from './services/microservices/order.microservice';

@Module({
  imports: [HttpModule],
  providers: [OrderMicroservice, OrderActivity],
  controllers: [OrderController],
})
export class OrderModule {}
