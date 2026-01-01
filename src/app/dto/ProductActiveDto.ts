import { ImageDto } from './ImageDto';
import { ColorDto } from './ColorDto';
import { SizeDto } from './SizeDto';

export interface ProductActiveDto {
  idProduct: number;
  nom: string;
  image: ImageDto | null;
  colors: ColorDto[];
  sizes: SizeDto[];
}
