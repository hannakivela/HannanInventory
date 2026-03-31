import { useState, useMemo } from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import CarCard from './components/CarCard';
import CarModal from './components/CarModal';
import ConfirmDialog from './components/ConfirmDialog';
import { initialCars, getNextId } from './data/cars';
import './App.css';

const defaultFilters = {
  search: '',
  make: '',
  bodyType: '',
  fuelType: '',
  color: '',
  minSeats: 2,
  yearFrom: '',
  yearTo: '',
  maxMileage: 300000,
};

export default function App() {
  const [cars, setCars] = useState(initialCars);
  const [filters, setFilters] = useState(defaultFilters);
  const [editCar, setEditCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteCar, setDeleteCar] = useState(null);
  const [sortBy, setSortBy] = useState('year-desc');

  const filteredCars = useMemo(() => {
    let result = cars.filter(car => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!car.make.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) return false;
      }
      if (filters.make && !car.make.toLowerCase().includes(filters.make.toLowerCase())) return false;
      if (filters.bodyType && car.bodyType !== filters.bodyType) return false;
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
      if (filters.color && car.color !== filters.color) return false;
      if (car.seats < filters.minSeats) return false;
      if (filters.yearFrom && car.year < Number(filters.yearFrom)) return false;
      if (filters.yearTo && car.year > Number(filters.yearTo)) return false;
      if (car.mileage > filters.maxMileage) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'year-desc': return b.year - a.year;
        case 'year-asc': return a.year - b.year;
        case 'make-asc': return (a.make + ' ' + a.model).localeCompare(b.make + ' ' + b.model);
        case 'mileage-asc': return a.mileage - b.mileage;
        case 'mileage-desc': return b.mileage - a.mileage;
        case 'hp-desc': return b.horsepower - a.horsepower;
        default: return 0;
      }
    });
    return result;
  }, [cars, filters, sortBy]);

  const handleSave = (carData) => {
    if (carData.id) {
      setCars(prev => prev.map(c => c.id === carData.id ? carData : c));
    } else {
      setCars(prev => [...prev, { ...carData, id: getNextId() }]);
    }
    setShowModal(false);
    setEditCar(null);
  };

  const handleEdit = (car) => {
    setEditCar(car);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditCar(null);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    setCars(prev => prev.filter(c => c.id !== deleteCar.id));
    setDeleteCar(null);
  };

  return (
    <div className="app">
      <Header carCount={cars.length} />

      <div className="app-layout">
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
          resultCount={filteredCars.length}
        />

        <main className="main-content">
          <div className="toolbar">
            <div className="toolbar-left">
              <h2 className="inventory-title">
                Inventaario
                {filteredCars.length !== cars.length && (
                  <span className="filtered-badge">{filteredCars.length} / {cars.length}</span>
                )}
              </h2>
            </div>
            <div className="toolbar-right">
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="year-desc">Uusimmat ensin</option>
                <option value="year-asc">Vanhimmat ensin</option>
                <option value="make-asc">Merkki A-Z</option>
                <option value="mileage-asc">Vähiten ajettu</option>
                <option value="mileage-desc">Eniten ajettu</option>
                <option value="hp-desc">Tehokkain ensin</option>
              </select>
              <button className="btn-add" onClick={handleAddNew}>
                ➕ Lisää auto
              </button>
            </div>
          </div>

          {filteredCars.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Ei tuloksia</h3>
              <p>Kokeile muuttaa suodattimiasi</p>
              <button className="reset-link" onClick={() => setFilters(defaultFilters)}>
                Tyhjennä suodattimet
              </button>
            </div>
          ) : (
            <div className="car-grid">
              {filteredCars.map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  onEdit={handleEdit}
                  onDelete={setDeleteCar}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <CarModal
          car={editCar}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditCar(null); }}
        />
      )}

      <ConfirmDialog
        car={deleteCar}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCar(null)}
      />
    </div>
  );
}
