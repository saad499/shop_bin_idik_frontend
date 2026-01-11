import { StatusProduct } from "../enum/StatusProduct";
import { ColorDto } from "./ColorDto";
import { ImageDto } from "./ImageDto";
import { SizeDto } from "./SizeDto";

export interface ProductDto {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  sizes: SizeDto[];
  colors: ColorDto[];
  images: ImageDto[];
  stock: number;
  status: StatusProduct;
  isActiveProduct: boolean;
  categorieId: number;
}