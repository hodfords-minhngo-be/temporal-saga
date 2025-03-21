import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from '~domains/orders/services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ReverseOrderDto } from '../dto/reverse-order.dto';

@Controller('orders')
export class OrderMicroservice {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(@Body() order: CreateOrderDto) {
    return this.orderService.createOrder(order.transactionId, order);
  }

  @Post('reverse')
  reverseOrder(@Body() order: ReverseOrderDto) {
    return this.orderService.reverseOrder(order.transactionId);
  }
}
