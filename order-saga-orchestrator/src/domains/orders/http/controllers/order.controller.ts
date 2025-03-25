import { Controller, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderInput } from '~domains/orders/types/order.type';
import { TemporalService } from '~domains/temporal/services/temporal.service';
import { placeOrderWorkflow } from '../../saga/workflows/place-order.workflow';

@Controller()
export class OrderController {
  constructor(private temporalService: TemporalService) {}

  @Post('orders')
  async placeOrder() {
    const transactionId = randomUUID();

    const input: CreateOrderInput = {
      transactionId,
      customerId: randomUUID(),
      productId: randomUUID(),
      quantity: 3,
    };

    const handle = await this.temporalService
      .client
      .workflow.start(placeOrderWorkflow, {
        taskQueue: 'order-saga',
        workflowId: `order-${transactionId}`,
        args: [input],
      });

    console.log('Workflow started:', handle.workflowId);
    const result = await handle.result();
    console.log('Workflow started:', result);
    return 'Order placed';
  }
}
