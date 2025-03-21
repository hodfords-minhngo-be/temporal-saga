import { Controller, Post } from '@nestjs/common';
import { OrderService } from '~domains/orders/services/order.service';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  placeOrder() {
    return this.orderService.placeOrder();
  }
}
