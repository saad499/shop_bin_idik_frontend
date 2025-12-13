import { OrderItem } from "./OrderItem";

export interface Order {
  id: number;
  dateCommande: Date;
  status: string;
  items: OrderItem[];
  totalProduits: number;
  totalHT: number;
  totalTaxes: number;
  totalTTC: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZipCode: string;
}