import { Router, Request, Response } from 'express';
import db from '../database';

const router = Router();

interface Car {
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

// GET all cars
router.get('/', (_req: Request, res: Response) => {
  try {
    const cars = db.prepare('SELECT * FROM cars ORDER BY make, model').all() as Car[];
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// GET single car
router.get('/:id', (req: Request, res: Response) => {
  try {
    const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id) as Car | undefined;
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// POST create new car
router.post('/', (req: Request, res: Response) => {
  try {
    const { make, model, year, color, type, quantity, range_km, is_electric, notes } = req.body;
    if (!make || !model || !year || !color || !type) {
      res.status(400).json({ error: 'Missing required fields: make, model, year, color, type' });
      return;
    }
    const result = db.prepare(`
      INSERT INTO cars (make, model, year, color, type, quantity, range_km, is_electric, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(make, model, year, color, type, quantity ?? 1, range_km ?? null, is_electric ? 1 : 0, notes ?? null);

    const newCar = db.prepare('SELECT * FROM cars WHERE id = ?').get(result.lastInsertRowid) as Car;
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create car' });
  }
});

// PATCH update car quantity
router.patch('/:id/quantity', (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 0) {
      res.status(400).json({ error: 'quantity must be a non-negative number' });
      return;
    }
    const result = db.prepare('UPDATE cars SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    const updated = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id) as Car;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// PUT update car
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { make, model, year, color, type, quantity, range_km, is_electric, notes } = req.body;
    if (!make || !model || !year || !color || !type) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const result = db.prepare(`
      UPDATE cars SET make=?, model=?, year=?, color=?, type=?, quantity=?, range_km=?, is_electric=?, notes=?
      WHERE id=?
    `).run(make, model, year, color, type, quantity ?? 1, range_km ?? null, is_electric ? 1 : 0, notes ?? null, req.params.id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    const updated = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id) as Car;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// DELETE car
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

export default router;
