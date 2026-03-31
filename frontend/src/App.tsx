import { useState, useEffect, useMemo } from 'react';
import { Car, CarFormData } from './types';
import { fetchCars, createCar, updateCar, updateCarQuantity, deleteCar } from './api';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import Header from './components/Header';
import CarCard from './components/CarCard';
import CarModal from './components/CarModal';
import ConfirmDialog from './components/ConfirmDialog';
import StatsBar from './components/StatsBar';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { themeClasses: tc } = useTheme();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingCarId, setDeletingCarId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCars();
      setCars(data);
    } catch {
      setError('Could not connect to server. Make sure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(data: CarFormData) {
    try {
      if (editingCar) {
        const updated = await updateCar(editingCar.id, data);
        setCars(cars.map((c) => (c.id === updated.id ? updated : c)));
        showToast('Car updated successfully!');
      } else {
        const created = await createCar(data);
        setCars([...cars, created]);
        showToast('Car added successfully!');
      }
      setShowModal(false);
      setEditingCar(null);
    } catch (err) {
      showToast('Failed to save car.', 'error');
    }
  }

  async function handleQuantityChange(id: number, qty: number) {
    try {
      const updated = await updateCarQuantity(id, qty);
      setCars(cars.map((c) => (c.id === updated.id ? updated : c)));
    } catch {
      showToast('Failed to update quantity.', 'error');
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteCar(id);
      setCars(cars.filter((c) => c.id !== id));
      setDeletingCarId(null);
      showToast('Car deleted.');
    } catch {
      showToast('Failed to delete car.', 'error');
    }
  }

  // Stats
  const stats = useMemo(() => {
    const electricCars = cars.filter((c) => c.is_electric === 1);
    const ranges = electricCars.filter((c) => c.range_km).map((c) => c.range_km as number);
    return {
      totalModels: cars.length,
      totalQuantity: cars.reduce((sum, c) => sum + c.quantity, 0),
      electricCount: electricCars.length,
      avgRange: ranges.length ? ranges.reduce((a, b) => a + b, 0) / ranges.length : null,
    };
  }, [cars]);

  // Filtered cars
  const carTypes = useMemo(() => ['All', ...Array.from(new Set(cars.map((c) => c.type))).sort()], [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        car.make.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.color.toLowerCase().includes(q) ||
        car.type.toLowerCase().includes(q) ||
        car.year.toString().includes(q);
      const matchesType = filterType === 'All' || car.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [cars, search, filterType]);

  const deletingCar = cars.find((c) => c.id === deletingCarId);

  return (
    <div className={`min-h-screen ${tc.bg} ${tc.text}`}>
      <Header
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setEditingCar(null);
          setShowModal(true);
        }}
        totalCars={stats.totalModels}
        totalQuantity={stats.totalQuantity}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <StatsBar {...stats} />

        {/* Type filter pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {carTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterType === type
                  ? `${tc.accentBg} text-white`
                  : `${tc.btnSecondary} opacity-70 hover:opacity-100`
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className={`animate-spin ${tc.textAccent}`} size={40} />
            <p className={tc.textMuted}>Loading inventory…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">⚠️</div>
            <p className={`text-center ${tc.textMuted} max-w-md`}>{error}</p>
            <button onClick={loadCars} className={`px-4 py-2 rounded-xl ${tc.btnPrimary}`}>
              Retry
            </button>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">🔍</div>
            <p className={`text-lg font-medium ${tc.textMuted}`}>
              {search || filterType !== 'All' ? 'No cars match your filters.' : 'No cars in inventory yet.'}
            </p>
            {!search && filterType === 'All' && (
              <button
                onClick={() => { setEditingCar(null); setShowModal(true); }}
                className={`px-4 py-2 rounded-xl ${tc.btnPrimary}`}
              >
                Add your first car ⚡
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onDelete={(id) => setDeletingCarId(id)}
                onQuantityChange={handleQuantityChange}
                onEdit={(car) => {
                  setEditingCar(car);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showModal && (
        <CarModal
          car={editingCar}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingCar(null);
          }}
        />
      )}

      {deletingCarId !== null && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deletingCar?.make} ${deletingCar?.model}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(deletingCarId)}
          onCancel={() => setDeletingCarId(null)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl transition-all z-50 ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
