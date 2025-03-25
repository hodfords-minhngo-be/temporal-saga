import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { envConfig } from '~configs/env.config';
import { CreateOrderInput } from '~domains/orders/types/order.type';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderMicroservice {
  private orderServiceUrl = envConfig.MICROSERVICES.ORDER_SERVICE_URL;

  constructor(private httpService: HttpService) {}

  async createOrder(orderInput: CreateOrderInput) {
    const order = await firstValueFrom(
      this.httpService.post(`${this.orderServiceUrl}/orders`, {
        ...orderInput,
      }),
    );
    return order.data;
  }

  async reverseOrder(transactionId: string) {
    return await firstValueFrom(
      this.httpService.post(`${this.orderServiceUrl}/orders/reverse-not-found`, {
        transactionId,
      }),
    );
  }
}
