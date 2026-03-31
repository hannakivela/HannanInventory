import { useTheme } from '../hooks/useTheme';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  const { themeClasses: tc } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative w-full max-w-sm rounded-2xl border ${tc.bgCard} ${tc.border} p-6 shadow-2xl`}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-900/40 flex items-center justify-center">
            <AlertTriangle className="text-red-400" size={28} />
          </div>
          <div>
            <h3 className={`text-lg font-bold mb-1 ${tc.text}`}>Confirm Delete</h3>
            <p className={`text-sm ${tc.textMuted}`}>{message}</p>
          </div>
          <div className="flex w-full gap-3">
            <button
              onClick={onCancel}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm ${tc.btnSecondary}`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm ${tc.btnDanger}`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
