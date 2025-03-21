import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { envConfig } from '~configs/env.config';

@Injectable()
export class OrderMicroservice {
  private orderServiceUrl = envConfig.MICROSERVICES.ORDER_SERVICE_URL;

  constructor(private httpService: HttpService) {}

  async createOrder(transactionId: string, order: any) {
    return this.httpService.post(`${this.orderServiceUrl}/orders`, {
      transactionId,
      order,
    });
  }

  async reverseOrder(transactionId: string) {
    return this.httpService.post(`${this.orderServiceUrl}/orders/reverse`, {
      transactionId,
    });
  }
}
