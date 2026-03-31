import { useState, useEffect } from 'react';
import { Car, CarFormData } from '../types';
import { useTheme } from '../hooks/useTheme';
import { X, Zap } from 'lucide-react';

interface CarModalProps {
  car?: Car | null;
  onSave: (data: CarFormData) => void;
  onClose: () => void;
}

const CAR_TYPES = ['Sedan', 'SUV', 'Sports', 'Truck', 'Hatchback', 'Crossover', 'Coupe SUV', 'Van', 'Convertible'];

const defaultForm: CarFormData = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  type: 'Sedan',
  quantity: 1,
  range_km: null,
  is_electric: true,
  notes: '',
};

export default function CarModal({ car, onSave, onClose }: CarModalProps) {
  const { themeClasses: tc } = useTheme();
  const [form, setForm] = useState<CarFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CarFormData, string>>>({});

  useEffect(() => {
    if (car) {
      setForm({
        make: car.make,
        model: car.model,
        year: car.year,
        color: car.color,
        type: car.type,
        quantity: car.quantity,
        range_km: car.range_km,
        is_electric: car.is_electric === 1,
        notes: car.notes || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [car]);

  function validate(): boolean {
    const errs: Partial<Record<keyof CarFormData, string>> = {};
    if (!form.make.trim()) errs.make = 'Make is required';
    if (!form.model.trim()) errs.model = 'Model is required';
    if (!form.year || form.year < 1886 || form.year > 2030) errs.year = 'Invalid year';
    if (!form.color.trim()) errs.color = 'Color is required';
    if (!form.type) errs.type = 'Type is required';
    if (form.quantity < 0) errs.quantity = 'Quantity cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSave(form);
    }
  }

  const inputClass = `w-full px-3 py-2 rounded-xl border ${tc.bgInput} ${tc.border} ${tc.text} text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50`;
  const labelClass = `block text-xs font-semibold mb-1.5 ${tc.textMuted} uppercase tracking-wide`;
  const errorClass = 'text-red-400 text-xs mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-2xl border ${tc.bgCard} ${tc.border} shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${tc.border}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className={`text-lg font-bold ${tc.text}`}>
              {car ? 'Edit Car' : 'Add New Car'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${tc.btnSecondary} transition-all`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Make & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Make *</label>
              <input
                type="text"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="e.g. Tesla"
                className={inputClass}
              />
              {errors.make && <p className={errorClass}>{errors.make}</p>}
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="e.g. Model 3"
                className={inputClass}
              />
              {errors.model && <p className={errorClass}>{errors.model}</p>}
            </div>
          </div>

          {/* Year & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Year *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })}
                min="1886"
                max="2030"
                className={inputClass}
              />
              {errors.year && <p className={errorClass}>{errors.year}</p>}
            </div>
            <div>
              <label className={labelClass}>Color *</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="e.g. Midnight Silver"
                className={inputClass}
              />
              {errors.color && <p className={errorClass}>{errors.color}</p>}
            </div>
          </div>

          {/* Type & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputClass}
              >
                {CAR_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                min="0"
                className={inputClass}
              />
              {errors.quantity && <p className={errorClass}>{errors.quantity}</p>}
            </div>
          </div>

          {/* Electric & Range */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className={labelClass}>Range (km)</label>
              <input
                type="number"
                value={form.range_km ?? ''}
                onChange={(e) => setForm({ ...form, range_km: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="e.g. 500"
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`${labelClass} flex items-center gap-1`}>
                <Zap size={12} />
                Electric Vehicle
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_electric: !form.is_electric })}
                className={`w-full py-2 rounded-xl border text-sm font-medium transition-all ${
                  form.is_electric
                    ? 'bg-green-500 text-white border-green-400'
                    : `${tc.btnSecondary} ${tc.border}`
                }`}
              >
                {form.is_electric ? '⚡ Yes, Electric' : '⛽ Not Electric'}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any notes about this car…"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${tc.btnSecondary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${tc.btnPrimary} ${tc.glow}`}
            >
              {car ? 'Save Changes' : '+ Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
