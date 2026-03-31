import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'data', 'inventory.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    range_km INTEGER,
    is_electric INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

const countRow = db.prepare('SELECT COUNT(*) as count FROM cars').get() as { count: number };
if (countRow.count === 0) {
  const insert = db.prepare(`
    INSERT INTO cars (make, model, year, color, type, quantity, range_km, is_electric, notes)
    VALUES (@make, @model, @year, @color, @type, @quantity, @range_km, @is_electric, @notes)
  `);

  const seedCars = [
    { make: 'Tesla', model: 'Model 3', year: 2023, color: 'White', type: 'Sedan', quantity: 2, range_km: 576, is_electric: 1, notes: 'Family daily driver' },
    { make: 'Tesla', model: 'Model Y', year: 2022, color: 'Midnight Silver', type: 'SUV', quantity: 1, range_km: 533, is_electric: 1, notes: 'Weekend trips' },
    { make: 'BMW', model: 'iX3', year: 2023, color: 'Phytonic Blue', type: 'SUV', quantity: 1, range_km: 460, is_electric: 1, notes: 'Premium EV' },
    { make: 'Volkswagen', model: 'ID.4', year: 2022, color: 'Glacier White', type: 'SUV', quantity: 2, range_km: 520, is_electric: 1, notes: 'Spacious and practical' },
    { make: 'Hyundai', model: 'IONIQ 6', year: 2023, color: 'Gravity Gold', type: 'Sedan', quantity: 1, range_km: 614, is_electric: 1, notes: 'Sleek streamliner' },
    { make: 'Kia', model: 'EV6', year: 2022, color: 'Aurora Black', type: 'Crossover', quantity: 1, range_km: 528, is_electric: 1, notes: 'Sports crossover' },
    { make: 'Mercedes', model: 'EQS', year: 2023, color: 'Obsidian Black', type: 'Sedan', quantity: 1, range_km: 770, is_electric: 1, notes: 'Luxury flagship' },
    { make: 'Audi', model: 'e-tron GT', year: 2022, color: 'Kemora Gray', type: 'Sports', quantity: 1, range_km: 488, is_electric: 1, notes: 'Performance EV' },
    { make: 'Rivian', model: 'R1T', year: 2023, color: 'Forest Green', type: 'Truck', quantity: 1, range_km: 515, is_electric: 1, notes: 'Electric adventure truck' },
    { make: 'Polestar', model: '2', year: 2023, color: 'Snow', type: 'Sedan', quantity: 1, range_km: 540, is_electric: 1, notes: 'Minimalist design' },
    { make: 'Toyota', model: 'bZ4X', year: 2023, color: 'Emotional Red', type: 'SUV', quantity: 2, range_km: 450, is_electric: 1, notes: 'Reliable family SUV' },
    { make: 'Ford', model: 'Mustang Mach-E', year: 2022, color: 'Grabber Blue', type: 'SUV', quantity: 1, range_km: 490, is_electric: 1, notes: 'Iconic pony car reimagined' },
    { make: 'Chevrolet', model: 'Bolt EV', year: 2023, color: 'Bright Blue', type: 'Hatchback', quantity: 3, range_km: 416, is_electric: 1, notes: 'Affordable city commuter' },
    { make: 'Nissan', model: 'Ariya', year: 2022, color: 'Pearl White', type: 'SUV', quantity: 1, range_km: 532, is_electric: 1, notes: 'Japanese precision EV' },
    { make: 'Porsche', model: 'Taycan', year: 2023, color: 'Frozen Berry', type: 'Sports', quantity: 1, range_km: 484, is_electric: 1, notes: 'German sports EV' },
    { make: 'Volvo', model: 'C40 Recharge', year: 2022, color: 'Cloud Blue', type: 'Coupe SUV', quantity: 1, range_km: 444, is_electric: 1, notes: 'Scandinavian clean design' },
    { make: 'Lucid', model: 'Air', year: 2023, color: 'Cosmos Silver', type: 'Sedan', quantity: 1, range_km: 836, is_electric: 1, notes: 'Record-breaking range' },
    { make: 'BYD', model: 'Han', year: 2023, color: 'Horizon Black', type: 'Sedan', quantity: 2, range_km: 605, is_electric: 1, notes: 'Chinese luxury EV' },
    { make: 'Genesis', model: 'GV60', year: 2022, color: 'Icy Blue Matte', type: 'SUV', quantity: 1, range_km: 470, is_electric: 1, notes: 'Korean luxury EV' },
    { make: 'Xpeng', model: 'P7', year: 2023, color: 'Sky Blue', type: 'Sedan', quantity: 1, range_km: 706, is_electric: 1, notes: 'Smart EV with autopilot' },
  ];

  const insertMany = db.transaction((cars: typeof seedCars) => {
    for (const car of cars) {
      insert.run(car);
    }
  });

  insertMany(seedCars);
  console.log('✅ Database seeded with 20 electric cars');
}

export default db;
