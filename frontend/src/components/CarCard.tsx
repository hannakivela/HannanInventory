import { Car } from '../types';
import { useTheme } from '../hooks/useTheme';
import { Minus, Plus, Trash2, Pencil, Zap, Battery } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onDelete: (id: number) => void;
  onQuantityChange: (id: number, qty: number) => void;
  onEdit: (car: Car) => void;
}

const CAR_TYPE_ICONS: Record<string, string> = {
  Sedan: '🚗',
  SUV: '🚙',
  Sports: '🏎️',
  Truck: '🛻',
  Hatchback: '🚘',
  Crossover: '🚐',
  'Coupe SUV': '🚙',
};

const COLOR_MAP: Record<string, string> = {
  White: '#f8fafc',
  'Glacier White': '#f0f9ff',
  Snow: '#f9fafb',
  'Pearl White': '#f8f8f8',
  'Cosmos Silver': '#a0aec0',
  'Kemora Gray': '#718096',
  'Midnight Silver': '#475569',
  Black: '#1a1a1a',
  'Obsidian Black': '#1a1a2e',
  'Aurora Black': '#1a1a3e',
  'Horizon Black': '#1c1c2e',
  Blue: '#3b82f6',
  'Grabber Blue': '#2563eb',
  'Phytonic Blue': '#1d4ed8',
  'Bright Blue': '#38bdf8',
  'Cloud Blue': '#7dd3fc',
  'Icy Blue Matte': '#bae6fd',
  'Sky Blue': '#93c5fd',
  Red: '#ef4444',
  'Emotional Red': '#dc2626',
  Green: '#22c55e',
  'Forest Green': '#16a34a',
  'Gravity Gold': '#f59e0b',
  'Frozen Berry': '#7c3aed',
};

function getColorSwatch(color: string): string {
  return COLOR_MAP[color] || '#6b7280';
}

export default function CarCard({ car, onDelete, onQuantityChange, onEdit }: CarCardProps) {
  const { themeClasses: tc } = useTheme();
  const icon = CAR_TYPE_ICONS[car.type] || '🚗';

  return (
    <div
      className={`car-card rounded-2xl border p-4 ${tc.bgCard} ${tc.border} ${tc.bgCardHover} transition-all`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className={`font-bold text-lg leading-tight ${tc.text}`}>
              {car.make} {car.model}
            </h3>
            <p className={`text-sm ${tc.textMuted}`}>{car.year} · {car.type}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(car)}
            className={`p-1.5 rounded-lg ${tc.btnSecondary} transition-all`}
            title="Edit car"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(car.id)}
            className={`p-1.5 rounded-lg ${tc.btnDanger} transition-all`}
            title="Delete car"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Color badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tc.badge}`}
        >
          <span
            className="w-3 h-3 rounded-full border border-white/20 inline-block"
            style={{ backgroundColor: getColorSwatch(car.color) }}
          />
          {car.color}
        </span>

        {/* Electric badge */}
        {car.is_electric === 1 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/60 text-green-300">
            <Zap size={10} className="text-green-400" />
            Electric
          </span>
        )}

        {/* Range badge */}
        {car.range_km && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300">
            <Battery size={10} />
            {car.range_km} km
          </span>
        )}
      </div>

      {/* Notes */}
      {car.notes && (
        <p className={`text-xs ${tc.textMuted} mb-3 italic leading-relaxed`}>
          "{car.notes}"
        </p>
      )}

      {/* Quantity control */}
      <div className={`flex items-center justify-between pt-3 border-t ${tc.border}`}>
        <span className={`text-sm font-medium ${tc.textMuted}`}>Quantity</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(car.id, Math.max(0, car.quantity - 1))}
            disabled={car.quantity <= 0}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              car.quantity <= 0
                ? 'opacity-30 cursor-not-allowed bg-gray-700'
                : tc.btnSecondary
            }`}
          >
            <Minus size={14} />
          </button>
          <span className={`w-8 text-center font-bold text-lg ${tc.textAccent}`}>
            {car.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(car.id, car.quantity + 1)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${tc.btnPrimary}`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
