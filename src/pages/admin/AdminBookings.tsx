import { useState } from 'react';
import { Search, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate, getBookingStatusColor, cn } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import type { BookingStatus } from '../../types';

export default function AdminBookings() {
  const { bookings, updateBookingStatus } = useStore();
  const { toasts, addToast, removeToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search) {
      return b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
             b.userName.toLowerCase().includes(search.toLowerCase()) ||
             b.serviceName.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
    addToast('success', `Booking ${status}`);
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="relative max-w-xs mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search bookings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              filter === f.value
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl">
          <EmptyState icon={<Calendar size={28} />} title="No bookings found" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{booking.bookingNumber}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', getBookingStatusColor(booking.status))}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="font-medium text-slate-900 text-sm">{booking.serviceName}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {booking.userName} • {formatDate(booking.date)} at {booking.time}
                  </div>
                </div>
                <div className="text-right">
                  {booking.price > 0 ? (
                    <div className="font-bold text-brand-600 text-sm">{formatCurrency(booking.price)}</div>
                  ) : (
                    <div className="font-semibold text-green-600 text-sm">Free</div>
                  )}
                </div>
              </div>

              {booking.status === 'pending' && (
                <div className="flex gap-2 pt-3 border-t border-slate-50">
                  <Button size="sm" variant="primary" onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                    <CheckCircle size={14} /> Confirm
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                    <XCircle size={14} /> Cancel
                  </Button>
                </div>
              )}
              {booking.status === 'confirmed' && (
                <div className="flex gap-2 pt-3 border-t border-slate-50">
                  <Button size="sm" variant="primary" onClick={() => handleStatusChange(booking.id, 'completed')}>
                    <CheckCircle size={14} /> Mark Completed
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                    <XCircle size={14} /> Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
