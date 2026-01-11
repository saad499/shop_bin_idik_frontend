export interface CreateOrderRequest {
  clientId: number;
  shippingAddress: string;
  billingAddress: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: number;
  sizeId?: number;
  colorId?: number;
  quantity: number;
  unitPrice: number;
}
