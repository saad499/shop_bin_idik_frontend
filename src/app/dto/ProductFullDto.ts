import { StatusProduct } from "../enum/StatusProduct";
import { CategoryDto } from "./CategoryDto";
import { ColorDto } from "./ColorDto";
import { ImageDto } from "./ImageDto";
import { SizeDto } from "./SizeDto";

export interface ProductFullDto {
  id: number;
  nom: string;
  description: string;
  prix: number;
  sizes: SizeDto[];
  colors: ColorDto[];
  images: ImageDto[];
  stock: number;
  status: StatusProduct;
  isActiveProduct: boolean;
  dateCreated: Date;
  categorie: CategoryDto;
}