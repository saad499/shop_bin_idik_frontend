export interface OrderDetailDto {
  numberOrder: number;
  orderDate: string;
  total: number;
  orderStatus: string;
  
  // Client info
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  clientTelephone: string;
  clientAdresse: string;
  
  // Order items
  items: OrderItemDetailDto[];
}

export interface OrderItemDetailDto {
  productName: string;
  productImage: string;
  colorName: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
