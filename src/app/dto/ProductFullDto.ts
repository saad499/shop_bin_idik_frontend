import { StatusProduct } from "../enum/StatusProduct";
import { CategoryDto } from "./CategoryDto";

export interface ProductFullDto {
  id: number;
  nom: string;
  description: string;
  prix: number;
  sizes: string[];
  stock: number;
  status: StatusProduct;
  isActiveProduct: boolean;
  dateCreated: string;
  categorie: CategoryDto;
}