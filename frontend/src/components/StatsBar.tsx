import { useTheme } from '../hooks/useTheme';

interface StatsBarProps {
  totalModels: number;
  totalQuantity: number;
  electricCount: number;
  avgRange: number | null;
}

export default function StatsBar({ totalModels, totalQuantity, electricCount, avgRange }: StatsBarProps) {
  const { themeClasses: tc } = useTheme();

  const stats = [
    { label: 'Total Models', value: totalModels, icon: '🚗' },
    { label: 'Total Vehicles', value: totalQuantity, icon: '🔢' },
    { label: 'Electric', value: electricCount, icon: '⚡' },
    { label: 'Avg Range', value: avgRange ? `${Math.round(avgRange)} km` : '—', icon: '🔋' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border p-4 text-center ${tc.bgCard} ${tc.border}`}
        >
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className={`text-xl font-bold ${tc.textAccent}`}>{stat.value}</div>
          <div className={`text-xs ${tc.textMuted} mt-0.5`}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
