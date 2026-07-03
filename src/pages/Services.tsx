import { useState } from 'react';
import {
  Banknote, Printer, GraduationCap, TrendingUp, PiggyBank, Monitor,
  Calendar, Clock, Check, ChevronRight, type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, getCategoryColor, getCategoryLabel, cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const iconMap: Record<string, LucideIcon> = {
  Banknote, Printer, GraduationCap, TrendingUp, PiggyBank, Monitor,
};

const serviceCategories = [
  { value: 'all', label: 'All Services' },
  { value: 'financial', label: 'Financial' },
  { value: 'printing', label: 'Printing' },
  { value: 'training', label: 'Training' },
  { value: 'consultancy', label: 'Consultancy' },
];

export default function Services() {
  const { services, createBooking } = useStore();
  const { toasts, addToast, removeToast } = useToast();
  const [category, setCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');

  const filtered = services.filter(s => category === 'all' || s.category === category);
  const service = services.find(s => s.id === selectedService);

  const handleOpenBooking = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingNotes('');
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingNotes('');
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    const booking = createBooking(selectedService, selectedDate, selectedTime, bookingNotes || undefined);
    addToast('success', `Booking confirmed! Reference: ${booking.bookingNumber}`);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Our Services</h1>
          <p className="text-slate-500 text-sm">Book appointments for financial services, printing, training, and professional consultations.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {serviceCategories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                category === cat.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No services available"
            description="There are no services in this category at the moment."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(svc => {
              const Icon = iconMap[svc.icon] || GraduationCap;
              return (
                <div
                  key={svc.id}
                  className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white flex-shrink-0">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn('inline-block text-xs px-2 py-0.5 rounded-full mb-1', getCategoryColor(svc.category))}>
                        {getCategoryLabel(svc.category)}
                      </span>
                      <h3 className="font-semibold text-slate-900">{svc.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 flex-1">{svc.description}</p>
                  <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {svc.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {svc.availableSlots.length} days available
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      {svc.price > 0 ? (
                        <span className="font-bold text-emerald-600">{formatCurrency(svc.price)}</span>
                      ) : (
                        <span className="font-semibold text-emerald-600 text-sm">Free Consultation</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleOpenBooking(svc.id)}
                      disabled={!svc.active}
                    >
                      Book Now <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        open={!!selectedService}
        onClose={handleCloseModal}
        title="Book Appointment"
        size="md"
      >
        {service && (
          <div>
            <div className="bg-emerald-50 rounded-xl p-4 mb-5">
              <h4 className="font-semibold text-slate-900 mb-1">{service.name}</h4>
              <p className="text-sm text-slate-600">{service.description}</p>
              {service.price > 0 && (
                <div className="mt-2 text-sm font-semibold text-emerald-700">
                  Fee: {formatCurrency(service.price)}
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
              <div className="grid grid-cols-3 gap-2">
                {service.availableSlots.map(slot => {
                  const date = new Date(slot.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = date.getDate();
                  const month = date.toLocaleDateString('en-US', { month: 'short' });
                  return (
                    <button
                      key={slot.date}
                      onClick={() => { setSelectedDate(slot.date); setSelectedTime(null); }}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all',
                        selectedDate === slot.date
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-brand-300'
                      )}
                    >
                      <div className="text-xs text-slate-500">{dayName}</div>
                      <div className="text-lg font-bold text-slate-900">{dayNum}</div>
                      <div className="text-xs text-slate-500">{month}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-5 animate-fadeIn">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {service.availableSlots.find(s => s.date === selectedDate)?.times.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all',
                        selectedTime === time
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 text-slate-600 hover:border-brand-300'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedTime && (
              <div className="mb-5 animate-fadeIn">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (optional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  rows={3}
                  placeholder="Any additional information for your appointment..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>
            )}

            {/* Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-slate-50 rounded-xl p-4 mb-5 animate-fadeIn">
                <div className="flex items-center gap-2 mb-2">
                  <Check size={18} className="text-green-500" />
                  <span className="font-medium text-sm text-slate-700">Booking Summary</span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Service: <span className="font-medium text-slate-900">{service.name}</span></div>
                  <div>Date: <span className="font-medium text-slate-900">{new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                  <div>Time: <span className="font-medium text-slate-900">{selectedTime}</span></div>
                  <div>Fee: <span className="font-medium text-slate-900">{service.price > 0 ? formatCurrency(service.price) : 'Free'}</span></div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleCloseModal}>Cancel</Button>
              <Button
                className="flex-1"
                disabled={!selectedDate || !selectedTime}
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
