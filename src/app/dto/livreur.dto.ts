import { TypeVehicule } from './type-vehicule.enum';

export interface LivreurDto {
  id?: number;
  nomComplet: string;
  prenomLivreur?: string;
  telephone: string;
  nomCommerce?: string;
  typeVehicule: TypeVehicule;
  numImmatriculation?: string;
  photoConducteur?: string;
  photoVehiculeRecto?: string;
  photoVehiculeVerso?: string;
  carteGriseRecto?: string;
  carteGriseVerso?: string;
  permisRecto?: string;
  permisVerso?: string;
  numeroPermis?: string;
  user: {
    email: string;
    username: string;
    password: string;
    role?: string;
  };
}
