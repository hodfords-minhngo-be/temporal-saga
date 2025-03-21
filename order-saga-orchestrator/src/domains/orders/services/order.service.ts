import { Injectable } from '@nestjs/common';
import { OrderMicroservice } from './microservices/order.microservice';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private orderMicroservice: OrderMicroservice) {}

  async placeOrder(orderId: string) {
    /**
     * 1. Call to order-service to place order
     * 2. Call to payment-service to make payment
     * 3. Call to shipping-service to ship order
     */
    const compensations = [];

    const transactionId = randomUUID(); // In saga pattern, this should be same for all services, so that we can rollback all services in case of failure

    try {
      // NOTE: step 1:
      compensations.unshift(() =>
        this.orderMicroservice.reverseOrder(transactionId),
      );
      await this.orderMicroservice.createOrder(transactionId, { orderId });

      // NOTE: step 2
    } catch (error) {
      for (const compensation of compensations) {
        await compensation();
      }
    }
  }
}
