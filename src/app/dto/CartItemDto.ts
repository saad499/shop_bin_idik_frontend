export interface CartItemDto {
  id: number;
  productId: number; // Add this field
  productName: string;
  productImage: string;
  colorName: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
