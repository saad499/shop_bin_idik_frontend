export interface DeliveryRequestResponseDto {
  requestId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  deliveryId: number;
  message?: string;
}
