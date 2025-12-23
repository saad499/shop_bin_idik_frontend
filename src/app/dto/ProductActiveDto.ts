import { ImageDto } from './ImageDto';

export interface ProductActiveDto {
  nom: string;
  image: ImageDto | null;
}
