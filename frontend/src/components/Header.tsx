import { Theme } from '../types';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Zap, Leaf, Search, Plus } from 'lucide-react';

interface HeaderProps {
  search: string;
  onSearch: (v: string) => void;
  onAdd: () => void;
  totalCars: number;
  totalQuantity: number;
}

const themes: { id: Theme; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: 'dark', label: 'Dark', icon: <Moon size={14} />, emoji: '🌙' },
  { id: 'light', label: 'Light', icon: <Sun size={14} />, emoji: '☀️' },
  { id: 'neon', label: 'Neon', icon: <Zap size={14} />, emoji: '⚡' },
  { id: 'nature', label: 'Nature', icon: <Leaf size={14} />, emoji: '🌿' },
];

export default function Header({ search, onSearch, onAdd, totalCars, totalQuantity }: HeaderProps) {
  const { theme, setTheme, themeClasses: tc } = useTheme();

  return (
    <header className={`sticky top-0 z-10 backdrop-blur-md border-b ${tc.header}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className={`text-3xl`}>⚡</div>
            <div>
              <h1 className={`text-xl font-bold ${tc.text}`}>
                Hanna's Car Inventory
              </h1>
              <p className={`text-xs ${tc.textMuted}`}>
                {totalCars} models · {totalQuantity} total vehicles
              </p>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  theme === t.id
                    ? `${tc.accentBg} text-white shadow-lg`
                    : `${tc.btnSecondary} opacity-60 hover:opacity-100`
                }`}
              >
                <span>{t.emoji}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search + Add row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${tc.textMuted}`} size={16} />
            <input
              type="text"
              placeholder="Search by make, model, color, type…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl border ${tc.bgInput} ${tc.border} ${tc.text} text-sm placeholder:${tc.textMuted} focus:outline-none focus:ring-2 focus:ring-sky-500/50`}
            />
          </div>
          <button
            onClick={onAdd}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${tc.btnPrimary} ${tc.glow}`}
          >
            <Plus size={16} />
            <span>Add Car</span>
          </button>
        </div>
      </div>
    </header>
  );
}
