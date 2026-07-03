import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={20} className="text-green-500" />,
  error: <XCircle size={20} className="text-red-500" />,
  info: <Info size={20} className="text-blue-500" />,
};

export function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3 min-w-[280px] max-w-sm animate-slideIn">
      {icons[toast.type]}
      <span className="text-sm text-slate-700 flex-1">{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}
