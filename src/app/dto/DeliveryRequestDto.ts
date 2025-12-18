export interface DeliveryRequestDto {
  deliveryId: number;
  orderId?: number;
  pickupAddress?: string;
  deliveryAddress?: string;
  contactMethod: 'MESSAGE' | 'CALL';
  estimatedPrice?: number;
}
