import { Injectable } from '@nestjs/common';
import { OrderMicroservice } from '~domains/orders/services/microservices/order.microservice';
import { CreateOrderInput } from '~domains/orders/types/order.type';
import {
  Activities,
  Activity,
} from '~domains/temporal/decorators/temporal-activity.decorator';

export interface OrderActivityInterface {
  createOrder(orderInput: CreateOrderInput): Promise<void>;
  reverseOrder(transactionId: string): Promise<void>;
}

@Injectable()
@Activities({
  taskQueue: 'order-saga',
  workflowPath: require.resolve('../place-order.workflow'),
})
export class OrderActivity {
  constructor(public orderMicroservice: OrderMicroservice) {}

  @Activity()
  async createOrder(orderInput: CreateOrderInput): Promise<void> {
    return this.orderMicroservice.createOrder(orderInput);
  }

  @Activity()
  async reverseOrder(transactionId: string): Promise<void> {
    await this.orderMicroservice.reverseOrder(transactionId);
  }
}
