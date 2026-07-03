import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, ChevronRight, CalendarPlus,
  CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  formatCurrency, formatDate, formatRelativeTime,
  getBookingStatusColor, cn,
} from '../lib/utils';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import type { Booking } from '../types';

const statusIcons: Record<string, typeof CheckCircle> = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function Bookings() {
  const { bookings, currentUser, updateBookingStatus } = useStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const userBookings = bookings.filter(b => b.userId === currentUser?.id);

  const filteredBookings = userBookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['pending', 'confirmed'].includes(b.status);
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const filters = [
    { value: 'all' as const, label: 'All' },
    { value: 'upcoming' as const, label: 'Upcoming' },
    { value: 'completed' as const, label: 'Completed' },
    { value: 'cancelled' as const, label: 'Cancelled' },
  ];

  const handleCancel = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your service appointments.</p>
          </div>
          <Link to="/services">
            <Button>
              <CalendarPlus size={16} /> New Booking
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                filter === f.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm">
            <EmptyState
              icon={<Calendar size={28} />}
              title="No bookings found"
              description="You haven't booked any services yet. Explore our services to make a booking."
              action={
                <Link to="/services">
                  <Button>Browse Services <ChevronRight size={16} /></Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map(booking => {
              const StatusIcon = statusIcons[booking.status] || Calendar;
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                        'bg-amber-100 text-amber-600'
                      )}>
                        <StatusIcon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">{booking.bookingNumber}</span>
                          <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', getBookingStatusColor(booking.status))}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="font-medium text-slate-900 text-sm">{booking.serviceName}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} /> {formatDate(booking.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {booking.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {booking.price > 0 ? (
                        <div className="font-bold text-brand-600 text-sm">{formatCurrency(booking.price)}</div>
                      ) : (
                        <div className="font-semibold text-green-600 text-sm">Free</div>
                      )}
                      <div className="text-xs text-slate-400 mt-1">{formatRelativeTime(booking.createdAt)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <Modal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        size="md"
      >
        {selectedBooking && (
          <div>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-slate-900">{selectedBooking.bookingNumber}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', getBookingStatusColor(selectedBooking.status))}>
                  {selectedBooking.status}
                </span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">{selectedBooking.serviceName}</h4>
              <p className="text-sm text-slate-500">Created {formatRelativeTime(selectedBooking.createdAt)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <Calendar size={14} /> Date
                </div>
                <div className="text-sm font-medium text-slate-900">{formatDate(selectedBooking.date)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <Clock size={14} /> Time
                </div>
                <div className="text-sm font-medium text-slate-900">{selectedBooking.time}</div>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="p-3 bg-amber-50 rounded-lg mb-5">
                <div className="text-xs text-amber-600 font-medium mb-1">Notes</div>
                <div className="text-sm text-amber-800">{selectedBooking.notes}</div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl mb-5">
              <span className="font-semibold text-slate-900">Service Fee</span>
              <span className="font-bold text-lg text-brand-600">
                {selectedBooking.price > 0 ? formatCurrency(selectedBooking.price) : 'Free'}
              </span>
            </div>

            {['pending', 'confirmed'].includes(selectedBooking.status) && (
              <Button
                variant="danger"
                className="w-full"
                onClick={() => handleCancel(selectedBooking.id)}
              >
                <XCircle size={16} /> Cancel Booking
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
