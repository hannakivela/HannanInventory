export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  type: string;
  quantity: number;
  range_km: number | null;
  is_electric: number;
  image_url: string | null;
  notes: string | null;
  created_at: string;
}

export type Theme = 'dark' | 'light' | 'neon' | 'nature';

export interface CarFormData {
  make: string;
  model: string;
  year: number;
  color: string;
  type: string;
  quantity: number;
  range_km: number | null;
  is_electric: boolean;
  notes: string;
}
