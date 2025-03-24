import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Worker, WorkerOptions } from '@temporalio/worker';
import { OrderMicroservice } from '~domains/orders/services/microservices/order.microservice';
import { CreateOrderInput } from '~domains/orders/types/order.type';

export interface OrderActivityInterface {
  createOrder(orderInput: CreateOrderInput): Promise<void>;
  reverseOrder(transactionId: string): Promise<void>;
}

@Injectable()
export class OrderActivity
  implements OrderActivityInterface, OnApplicationBootstrap
{
  constructor(private orderMicroservice: OrderMicroservice) {}

  async onApplicationBootstrap() {
    const opts: WorkerOptions = {
      workflowsPath: require.resolve('../workflows/place-order.workflow'),
      activities: {
        createOrder: this.createOrder.bind(this),
        reverseOrder: this.reverseOrder.bind(this),
      },
      taskQueue: 'order-activity',
    };

    const worker = await Worker.create(opts);
    await worker.run();
  }

  async createOrder(orderInput: CreateOrderInput): Promise<void> {
    return this.orderMicroservice.createOrder(orderInput);
  }

  async reverseOrder(transactionId: string): Promise<void> {
    await this.orderMicroservice.reverseOrder(transactionId);
  }
}
