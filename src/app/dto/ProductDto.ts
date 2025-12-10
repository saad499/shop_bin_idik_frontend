import { StatusProduct } from "../enum/StatusProduct";

export interface ProductDto {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  sizes: string[];
  stock: number;
  status: StatusProduct;
  categorieId: number;
  isActiveProduct?: boolean;
}