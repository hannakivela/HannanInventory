import { useState, useEffect } from 'react';
import { FUEL_TYPES, BODY_TYPES, CAR_COLORS } from '../data/cars';
import './CarModal.css';

const emptyForm = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: 'Valkoinen',
  bodyType: 'Sedan',
  fuelType: 'Bensiini',
  seats: 5,
  mileage: 0,
  horsepower: 100,
  licensePlate: '',
  notes: '',
};

export default function CarModal({ car, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!car;

  useEffect(() => {
    if (car) {
      setForm({ ...emptyForm, ...car });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [car]);

  const handleChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.make.trim()) e.make = 'Merkki vaaditaan';
    if (!form.model.trim()) e.model = 'Malli vaaditaan';
    if (!form.year || form.year < 1886 || form.year > new Date().getFullYear() + 1) e.year = 'Tarkista vuosi';
    if (!form.licensePlate.trim()) e.licensePlate = 'Rekisterinumero vaaditaan';
    if (form.mileage < 0) e.mileage = 'Ei negatiivinen';
    if (form.horsepower < 1) e.horsepower = 'Tarkista hevosvoimat';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      year: Number(form.year),
      seats: Number(form.seats),
      mileage: Number(form.mileage),
      horsepower: Number(form.horsepower),
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? '✏️ Muokkaa autoa' : '🚗 Lisää uusi auto'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Merkki *</label>
              <input
                value={form.make}
                onChange={e => handleChange('make', e.target.value)}
                placeholder="esim. Toyota"
                className={errors.make ? 'error' : ''}
              />
              {errors.make && <span className="err-msg">{errors.make}</span>}
            </div>
            <div className="form-group">
              <label>Malli *</label>
              <input
                value={form.model}
                onChange={e => handleChange('model', e.target.value)}
                placeholder="esim. Corolla"
                className={errors.model ? 'error' : ''}
              />
              {errors.model && <span className="err-msg">{errors.model}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vuosimalli *</label>
              <input
                type="number"
                value={form.year}
                onChange={e => handleChange('year', e.target.value)}
                min="1886"
                max={new Date().getFullYear() + 1}
                className={errors.year ? 'error' : ''}
              />
              {errors.year && <span className="err-msg">{errors.year}</span>}
            </div>
            <div className="form-group">
              <label>Rekisterinumero *</label>
              <input
                value={form.licensePlate}
                onChange={e => handleChange('licensePlate', e.target.value.toUpperCase())}
                placeholder="esim. ABC-123"
                className={errors.licensePlate ? 'error' : ''}
              />
              {errors.licensePlate && <span className="err-msg">{errors.licensePlate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Korimuoto</label>
              <select value={form.bodyType} onChange={e => handleChange('bodyType', e.target.value)}>
                {BODY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Käyttövoima</label>
              <select value={form.fuelType} onChange={e => handleChange('fuelType', e.target.value)}>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Väri</label>
              <select value={form.color} onChange={e => handleChange('color', e.target.value)}>
                {CAR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Istuinpaikat</label>
              <input
                type="number"
                value={form.seats}
                onChange={e => handleChange('seats', e.target.value)}
                min="1"
                max="12"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kilometrit</label>
              <input
                type="number"
                value={form.mileage}
                onChange={e => handleChange('mileage', e.target.value)}
                min="0"
                className={errors.mileage ? 'error' : ''}
              />
              {errors.mileage && <span className="err-msg">{errors.mileage}</span>}
            </div>
            <div className="form-group">
              <label>Hevosvoimat (hv)</label>
              <input
                type="number"
                value={form.horsepower}
                onChange={e => handleChange('horsepower', e.target.value)}
                min="1"
                className={errors.horsepower ? 'error' : ''}
              />
              {errors.horsepower && <span className="err-msg">{errors.horsepower}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Muistiinpanot</label>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Lisätietoja autosta..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Peruuta
            </button>
            <button type="submit" className="btn-save">
              {isEdit ? '💾 Tallenna muutokset' : '➕ Lisää auto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
