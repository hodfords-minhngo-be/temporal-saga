import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
import { OrderMicroservice } from './http/microservices/order.microservice';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderRepository, OrderService],
  controllers: [OrderMicroservice],
})
export class OrderModule {}
