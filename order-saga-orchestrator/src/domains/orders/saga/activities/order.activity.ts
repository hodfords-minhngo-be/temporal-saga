import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Worker, WorkerOptions } from '@temporalio/worker';
import { OrderMicroservice } from '~domains/orders/services/microservices/order.microservice';
import { CreateOrderInput } from '~domains/orders/types/order.type';

export interface OrderActivityInterface {
  createOrder(orderInput: CreateOrderInput): Promise<void>;
  reverseOrder(transactionId: string): Promise<void>;
}

@Injectable()
export class OrderActivity
  implements
    OrderActivityInterface,
    OnModuleInit,
    OnModuleDestroy,
    OnApplicationBootstrap
{
  private worker: Worker;
  private timerId: ReturnType<typeof setInterval>;

  constructor(private orderMicroservice: OrderMicroservice) {}

  clearInterval() {
    this.timerId && clearInterval(this.timerId);
    this.timerId = null;
  }

  async onModuleInit() {
    const opts: WorkerOptions = {
      workflowsPath: require.resolve('../workflows/place-order.workflow'),
      activities: {
        createOrder: this.createOrder.bind(this),
        reverseOrder: this.reverseOrder.bind(this),
      },
      taskQueue: 'order-saga',
    };

    const worker = await Worker.create(opts);
    this.worker = worker;
  }

  onModuleDestroy() {
    try {
      this.worker?.shutdown();
    } catch (err: any) {}

    this.clearInterval();
  }

  async onApplicationBootstrap() {
    this.timerId = setInterval(() => {
      if (this.worker) {
        this.worker.run();
        this.clearInterval();
      }
    }, 1000);
  }

  async createOrder(orderInput: CreateOrderInput): Promise<void> {
    return this.orderMicroservice.createOrder(orderInput);
  }

  async reverseOrder(transactionId: string): Promise<void> {
    await this.orderMicroservice.reverseOrder(transactionId);
  }
}
