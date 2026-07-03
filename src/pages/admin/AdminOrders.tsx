import { useState } from 'react';
import { Search, ShoppingCart, ChevronRight, Package } from 'lucide-react';
import { useStore } from '../../store/useStore';
import {
  formatCurrency, formatDateTime, getPaymentMethodLabel,
  getOrderStatusColor, getPaymentStatusColor, cn,
} from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import type { Order, OrderStatus } from '../../types';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const { toasts, addToast, removeToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [statusNote, setStatusNote] = useState('');

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      return o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
             o.userName.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleUpdateStatus = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, statusNote || `Status updated to ${newStatus}`);
    addToast('success', `Order status updated to ${newStatus}`);
    setSelectedOrder(null);
    setNewStatus('pending');
    setStatusNote('');
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
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
          <EmptyState icon={<ShoppingCart size={28} />} title="No orders found" />
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Payment</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-slate-900">{order.orderNumber}</div>
                      <div className="text-xs text-slate-400">{formatDateTime(order.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{order.userName}</td>
                    <td className="px-4 py-3 text-right font-bold text-sm text-slate-900">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium capitalize', getOrderStatusColor(order.status))}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getPaymentStatusColor(order.paymentStatus))}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}
                        className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 mx-auto"
                      >
                        Manage <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Order Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Manage ${selectedOrder?.orderNumber || 'Order'}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Customer</div>
                <div className="font-medium text-sm">{selectedOrder.userName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Payment Method</div>
                <div className="font-medium text-sm">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                <div className="text-xs text-slate-500 mb-1">Shipping Address</div>
                <div className="font-medium text-sm">{selectedOrder.shippingAddress}</div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-5">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-3 mt-2 bg-brand-50 rounded-lg">
                <span className="font-semibold text-sm">Total</span>
                <span className="font-bold text-brand-600">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status Update */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">Update Order Status</h4>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setNewStatus(opt.value)}
                    className={cn(
                      'px-2 py-2 rounded-lg text-xs font-medium border-2 transition-all',
                      newStatus === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:border-brand-300'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="Add a note (e.g., 'Dispatched via courier')..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 mb-3"
              />
              <Button className="w-full" onClick={handleUpdateStatus}>
                <Package size={16} /> Update Status
              </Button>
            </div>

            {/* Tracking History */}
            <div className="border-t border-slate-100 pt-4 mt-4">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">Tracking History</h4>
              <div className="space-y-2">
                {selectedOrder.trackingHistory.map((event, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium capitalize">{event.status}</span>
                      <span className="text-slate-400 ml-2 text-xs">{formatDateTime(event.timestamp)}</span>
                      <div className="text-xs text-slate-500">{event.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
