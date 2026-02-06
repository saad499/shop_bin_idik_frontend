import { UserDTO } from './user.dto';

export interface CommercantDTO {
  id?: number;
  nom: string;
  prenom: string;
  telephone: string;
  nomCommerce: string;
  businessName?: string;
  categorie: string;
  adresse: string;
  ville: string;
  logo?: string;
  description?: string;
  numImmatriculationFiscale?: string;
  registreCommerce?: string;
  documentAutre?: string;
  prenomCommerce?: string;
  businessAddress?: string;
  user: UserDTO;
}
