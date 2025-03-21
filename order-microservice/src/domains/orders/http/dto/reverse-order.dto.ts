import { IsInt, IsString } from 'class-validator';

export class ReverseOrderDto {
  @IsString()
  transactionId: string;
}
