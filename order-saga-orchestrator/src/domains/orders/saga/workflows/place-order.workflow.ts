import { proxyActivities } from '@temporalio/workflow';
import { OrderActivityInterface } from '../activities/order.activity';
import { CreateOrderInput } from '~domains/orders/types/order.type';

const { createOrder, reverseOrder } = proxyActivities<OrderActivityInterface>({
  startToCloseTimeout: '1m',
  taskQueue: 'order-activity',
});

export async function placeOrderWorkflow(
  orderInput: CreateOrderInput,
): Promise<void> {
  const compensations = [];

  try {
    compensations.push({
      fn: () => reverseOrder(orderInput.transactionId),
    });
    return createOrder(orderInput);
  } catch (err) {
    console.error('Failed to place order:', err);
    for (const compensation of compensations) {
      await compensation.fn();
    }
  }
}
