import { CartItemDto } from './CartItemDto';

export interface CartSummaryDto {
  items: CartItemDto[];
  totalItems: number;
  totalPrice: number;
}
