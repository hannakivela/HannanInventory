import { COLOR_MAP } from '../data/cars';
import './CarCard.css';

const FUEL_ICONS = {
  Bensiini: '⛽',
  Diesel: '🛢️',
  Sähkö: '⚡',
  Hybridi: '🔋',
  'Plug-in Hybridi': '🔌',
};

const BODY_ICONS = {
  Sedan: '🚗',
  Farmari: '🚙',
  Maasturi: '🛻',
  Hatchback: '🚗',
  Minivan: '🚐',
  Coupe: '🏎️',
  Kabrioletti: '🚘',
  Pakettiauto: '🚚',
};

export default function CarCard({ car, onEdit, onDelete }) {
  const colorHex = COLOR_MAP[car.color] || '#888';
  const isDark = ['Musta', 'Sininen', 'Vihreä', 'Ruskea'].includes(car.color);
  const textOnColor = isDark ? '#fff' : '#111';

  return (
    <div className="car-card">
      <div className="car-card-top" style={{ background: `linear-gradient(135deg, ${colorHex}cc, ${colorHex}66)` }}>
        <div className="car-emoji">{BODY_ICONS[car.bodyType] || car.image || '🚗'}</div>
        <div className="car-plate" style={{ color: textOnColor, borderColor: `${textOnColor}55` }}>
          {car.licensePlate}
        </div>
        <div className="car-fuel-badge">
          <span>{FUEL_ICONS[car.fuelType]}</span>
          <span>{car.fuelType}</span>
        </div>
      </div>

      <div className="car-card-body">
        <div className="car-name-row">
          <h3 className="car-name">{car.make} {car.model}</h3>
          <span className="car-year">{car.year}</span>
        </div>

        <div className="car-color-row">
          <span
            className="color-dot"
            style={{ background: colorHex, border: car.color === 'Valkoinen' ? '1px solid #ccc' : 'none' }}
          />
          <span className="color-label">{car.color}</span>
          <span className="body-type">{car.bodyType}</span>
        </div>

        <div className="car-stats">
          <div className="stat-item">
            <span className="stat-icon">💺</span>
            <span>{car.seats} paikkaa</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🛣️</span>
            <span>{car.mileage.toLocaleString('fi-FI')} km</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <span>{car.horsepower} hv</span>
          </div>
        </div>

        {car.notes && (
          <p className="car-notes">💬 {car.notes}</p>
        )}

        <div className="car-actions">
          <button className="btn-edit" onClick={() => onEdit(car)}>
            ✏️ Muokkaa
          </button>
          <button className="btn-delete" onClick={() => onDelete(car)}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
