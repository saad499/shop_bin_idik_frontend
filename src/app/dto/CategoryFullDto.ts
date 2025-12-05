export interface CategoryFullDto {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  // Add any additional fields returned by the backend
}