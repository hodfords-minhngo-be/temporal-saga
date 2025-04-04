import { IsInt, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  transactionId: string;

  @IsString()
  customerId: string;

  @IsString()
  productId: string;

  @IsInt()
  quantity: number;
}
