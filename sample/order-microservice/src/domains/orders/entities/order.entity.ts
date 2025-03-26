import { Column, Entity } from 'typeorm';
import { BaseEntity } from '~shared/entities/base.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum ShippingStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'transaction_id' })
  transactionId: string;

  @Column({ type: 'varchar', length: 255, name: 'customer_id' })
  customerId: string;

  @Column({ type: 'varchar', length: 255, name: 'product_id' })
  productId: string;

  @Column({ type: 'int', name: 'quantity' })
  quantity: number;

  @Column({ type: 'varchar', length: 255, name: 'status' })
  status: string;

  @Column({ type: 'varchar', length: 255, name: 'payment_status' })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 255, name: 'shipping_status' })
  shippingStatus: string;
}
