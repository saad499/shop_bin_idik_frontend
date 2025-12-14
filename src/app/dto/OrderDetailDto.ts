import { StatusOrder } from '../enum/StatusOrder';
import { OrderItemDetailDto } from './OrderItemDetailDto';

export interface OrderDetailDto {
  numberOrder: number;
  orderDate: Date;
  total: number;
  orderStatus: StatusOrder;
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  clientTelephone: string;
  clientAdresse: string;
  items: OrderItemDetailDto[];
}
