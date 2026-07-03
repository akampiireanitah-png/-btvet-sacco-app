import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ChevronRight, MapPin, CreditCard, Clock,
  CheckCircle, Circle, Truck, XCircle, ShoppingBag,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  formatCurrency, formatDateTime, formatRelativeTime,
  getOrderStatusColor, getPaymentMethodLabel, getPaymentStatusColor, cn,
} from '../lib/utils';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import type { Order, OrderStatus } from '../types';

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusIcons: Record<string, typeof Circle> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function Orders() {
  const { orders, currentUser } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');

  const userOrders = orders.filter(o => o.userId === currentUser?.id);

  const filteredOrders = userOrders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status);
    if (filter === 'delivered') return o.status === 'delivered';
    if (filter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const filters = [
    { value: 'all' as const, label: 'All Orders' },
    { value: 'active' as const, label: 'Active' },
    { value: 'delivered' as const, label: 'Delivered' },
    { value: 'cancelled' as const, label: 'Cancelled' },
  ];

  const getStepIndex = (status: OrderStatus) => statusSteps.indexOf(status);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-500 text-sm mb-6">Track and manage your product orders.</p>

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
              <span className="ml-2 text-xs opacity-70">
                {f.value === 'all' ? userOrders.length : userOrders.filter(o => {
                  if (f.value === 'active') return !['delivered', 'cancelled'].includes(o.status);
                  return o.status === f.value;
                }).length}
              </span>
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm">
            <EmptyState
              icon={<Package size={28} />}
              title="No orders found"
              description="You haven't placed any orders yet. Start shopping to see your orders here."
              action={
                <Link to="/shop">
                  <Button>Start Shopping <ShoppingBag size={16} /></Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => {
              const StatusIcon = statusIcons[order.status] || Circle;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{order.orderNumber}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', getOrderStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{formatRelativeTime(order.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-brand-600">{formatCurrency(order.total)}</div>
                      <div className="text-xs text-slate-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>

                  {/* Mini tracking */}
                  {order.status !== 'cancelled' && (
                    <div className="flex items-center gap-1 mb-2">
                      {statusSteps.map((step, i) => {
                        const currentIndex = getStepIndex(order.status as OrderStatus);
                        const isCompleted = i <= currentIndex;
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              isCompleted ? 'bg-brand-500' : 'bg-slate-200'
                            )} />
                            {i < statusSteps.length - 1 && (
                              <div className={cn(
                                'h-0.5 flex-1',
                                i < currentIndex ? 'bg-brand-500' : 'bg-slate-200'
                              )} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <StatusIcon size={16} className={order.status === 'delivered' ? 'text-green-500' : 'text-slate-400'} />
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <span className="text-sm text-brand-600 font-medium flex items-center gap-1">
                      View Details <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.orderNumber || 'Order Details'}
        size="lg"
      >
        {selectedOrder && (
          <div>
            {/* Status Timeline */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Tracking History</h4>
              {selectedOrder.status === 'cancelled' ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                  <XCircle size={24} className="text-red-500" />
                  <div>
                    <div className="font-medium text-red-700">Order Cancelled</div>
                    <div className="text-sm text-red-500">This order has been cancelled.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {statusSteps.map((step, i) => {
                    const currentIndex = getStepIndex(selectedOrder.status as OrderStatus);
                    const isCompleted = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    const event = selectedOrder.trackingHistory.find(e => e.status === step);
                    const Icon = statusIcons[step] || Circle;

                    return (
                      <div key={step} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            isCompleted ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-300'
                          )}>
                            <Icon size={16} />
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div className={cn('w-0.5 h-8', i < currentIndex ? 'bg-brand-500' : 'bg-slate-200')} />
                          )}
                        </div>
                        <div className="pt-1 pb-8">
                          <div className={cn(
                            'font-medium text-sm capitalize',
                            isCompleted ? 'text-slate-900' : 'text-slate-400'
                          )}>
                            {step}
                          </div>
                          {event && (
                            <>
                              <div className="text-xs text-slate-500 mt-0.5">{formatDateTime(event.timestamp)}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{event.note}</div>
                            </>
                          )}
                          {isCurrent && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
                              Current Status
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.quantity} {item.unit} × {formatCurrency(item.price)}</div>
                    </div>
                    <div className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <MapPin size={14} /> Shipping Address
                </div>
                <div className="text-sm text-slate-900">{selectedOrder.shippingAddress}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <CreditCard size={14} /> Payment
                </div>
                <div className="text-sm text-slate-900">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</div>
                <span className={cn('inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium', getPaymentStatusColor(selectedOrder.paymentStatus))}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
              <span className="font-semibold text-slate-900">Total Amount</span>
              <span className="font-bold text-xl text-brand-600">{formatCurrency(selectedOrder.total)}</span>
            </div>

            {selectedOrder.notes && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <div className="text-xs text-amber-600 font-medium mb-1">Order Notes</div>
                <div className="text-sm text-amber-800">{selectedOrder.notes}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
