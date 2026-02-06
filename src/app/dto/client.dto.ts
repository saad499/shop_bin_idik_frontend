import { UserDTO } from './user.dto';

export interface ClientDTO {
  id?: number;
  user: UserDTO;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
}
