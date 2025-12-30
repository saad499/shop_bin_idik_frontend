import { ImageDto } from './ImageDto';

export interface ProductActiveDto {
  idProduct: number;
  nom: string;
  image: ImageDto | null;
}
