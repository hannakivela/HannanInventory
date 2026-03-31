import { Car, CarFormData } from './types';

const API_BASE = '/api';

export async function fetchCars(): Promise<Car[]> {
  const res = await fetch(`${API_BASE}/cars`);
  if (!res.ok) throw new Error('Failed to fetch cars');
  return res.json();
}

export async function createCar(data: CarFormData): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create car');
  }
  return res.json();
}

export async function updateCarQuantity(id: number, quantity: number): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars/${id}/quantity`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update quantity');
  return res.json();
}

export async function updateCar(id: number, data: CarFormData): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update car');
  return res.json();
}

export async function deleteCar(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/cars/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete car');
}
