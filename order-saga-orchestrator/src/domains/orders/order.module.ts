import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderMicroservice } from './services/microservices/order.microservice';
import { OrderController } from './http/controllers/order.controller';
import { OrderActivity } from './saga/activities/order.activity';

@Module({
  imports: [HttpModule],
  providers: [OrderMicroservice, OrderActivity],
  controllers: [OrderController],
})
export class OrderModule {}
