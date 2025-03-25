import { Controller, Post } from '@nestjs/common';
import { Client } from '@temporalio/client';
import { randomUUID } from 'crypto';
import { placeOrderWorkflow } from '~domains/orders/saga/workflows/place-order/place-order.workflow';
import { CreateOrderInput } from '~domains/orders/types/order.type';
import { InjectTemporalClient } from '~domains/temporal/decorators/inject-temporal.decorator';

@Controller()
export class OrderController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: Client,
  ) {}

  @Post('orders')
  async placeOrder() {
    const transactionId = randomUUID();

    const input: CreateOrderInput = {
      transactionId,
      customerId: randomUUID(),
      productId: randomUUID(),
      quantity: 3,
    };

    const handle = await this.temporalClient.workflow.start(
      placeOrderWorkflow,
      {
        taskQueue: 'order-saga',
        workflowId: `order-${transactionId}`,
        args: [input],
      },
    );

    console.log('Workflow started:', handle.workflowId);
    const result = await handle.result();
    console.log('Workflow started:', result);
    return 'Order placed';
  }
}
