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

    console.log('Placing order:', input);
    const handle = await this.temporalService
      .getClient()
      .workflow.start(placeOrderWorkflow, {
        taskQueue: 'test-activity',
        workflowId: `place-order`,
        args: [input],
      });

    const result = await handle.result();
    console.log('Workflow started:', result);
    return 'Order placed';
  }
}
