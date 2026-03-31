import { useState } from 'react';
import { FUEL_TYPES, BODY_TYPES, CAR_COLORS } from '../data/cars';
import './FilterPanel.css';

const currentYear = new Date().getFullYear();

export default function FilterPanel({ filters, onFilterChange, onReset, resultCount }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <aside className={`filter-panel${collapsed ? ' collapsed' : ''}`}>
      <div className="filter-header">
        <div className="filter-title-row">
          <h2 className="filter-title">🔍 Suodattimet</h2>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Avaa' : 'Pienennä'}>
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
        {!collapsed && (
          <span className="result-count">{resultCount} tulosta</span>
        )}
      </div>

      {!collapsed && (
        <div className="filter-body">
          <div className="filter-group">
            <label>Haku</label>
            <input
              type="text"
              placeholder="Merkki tai malli..."
              value={filters.search}
              onChange={e => handleChange('search', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Merkki</label>
            <input
              type="text"
              placeholder="esim. Volvo, Toyota..."
              value={filters.make}
              onChange={e => handleChange('make', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Korimuoto</label>
            <select
              value={filters.bodyType}
              onChange={e => handleChange('bodyType', e.target.value)}
              className="filter-select"
            >
              <option value="">Kaikki</option>
              {BODY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Käyttövoima</label>
            <select
              value={filters.fuelType}
              onChange={e => handleChange('fuelType', e.target.value)}
              className="filter-select"
            >
              <option value="">Kaikki</option>
              {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Väri</label>
            <select
              value={filters.color}
              onChange={e => handleChange('color', e.target.value)}
              className="filter-select"
            >
              <option value="">Kaikki värit</option>
              {CAR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Istuimet (min.)</label>
            <div className="range-row">
              <input
                type="range"
                min="2"
                max="9"
                value={filters.minSeats}
                onChange={e => handleChange('minSeats', Number(e.target.value))}
                className="range-input"
              />
              <span className="range-value">{filters.minSeats}+</span>
            </div>
          </div>

          <div className="filter-group">
            <label>Vuosi</label>
            <div className="year-row">
              <input
                type="number"
                min="1990"
                max={currentYear}
                placeholder="Alkaen"
                value={filters.yearFrom}
                onChange={e => handleChange('yearFrom', e.target.value)}
                className="filter-input small"
              />
              <span>–</span>
              <input
                type="number"
                min="1990"
                max={currentYear}
                placeholder="Asti"
                value={filters.yearTo}
                onChange={e => handleChange('yearTo', e.target.value)}
                className="filter-input small"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Maks. kilometrit</label>
            <div className="range-row">
              <input
                type="range"
                min="0"
                max="300000"
                step="5000"
                value={filters.maxMileage}
                onChange={e => handleChange('maxMileage', Number(e.target.value))}
                className="range-input"
              />
              <span className="range-value">{filters.maxMileage === 300000 ? '∞' : `${filters.maxMileage.toLocaleString('fi-FI')} km`}</span>
            </div>
          </div>

          <button className="reset-btn" onClick={onReset}>
            ↺ Tyhjennä suodattimet
          </button>
        </div>
      )}
    </aside>
  );
}
