import { Injectable } from '@nestjs/common';
import {
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async createOrder(transactionId: string, order: any) {
    return this.orderRepository.save({
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      shippingStatus: ShippingStatus.PENDING,
      productId: order.productId,
      quantity: order.quantity,
      customerId: order.customerId,
      transactionId,
    });
  }

  async reverseOrder(transactionId: string) {
    return this.orderRepository.delete({ transactionId });
  }

  async updateOrderStatus(transactionId: string, status: OrderStatus) {
    return this.orderRepository.update({ transactionId }, { status });
  }

  async updatePaymentStatus(
    transactionId: string,
    paymentStatus: PaymentStatus,
  ) {
    return this.orderRepository.update({ transactionId }, { paymentStatus });
  }

  async updateShippingStatus(
    transactionId: string,
    shippingStatus: ShippingStatus,
  ) {
    return this.orderRepository.update({ transactionId }, { shippingStatus });
  }
}
