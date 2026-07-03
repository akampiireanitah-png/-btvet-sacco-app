import { useState } from 'react';
import { Search, Boxes, TrendingUp, Plus, AlertCircle, Package } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDateTime, getCategoryLabel, cn } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

export default function AdminInventory() {
  const { products, inventoryLogs, restockProduct, currentUser } = useStore();
  const { toasts, addToast, removeToast } = useToast();
  const [search, setSearch] = useState('');
  const [restockProduct_id, setRestockProductId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = products.filter(p => p.stock < 20);
  const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const totalCostValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const potentialProfit = totalStockValue - totalCostValue;

  const handleRestock = () => {
    if (!restockProduct_id || !restockQty) return;
    const qty = parseInt(restockQty);
    if (qty <= 0) return;
    restockProduct(restockProduct_id, qty, currentUser?.name || 'Admin');
    const product = products.find(p => p.id === restockProduct_id);
    addToast('success', `${product?.name} restocked with ${qty} units`);
    setRestockProductId(null);
    setRestockQty('');
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-slate-400" />
            <span className="text-xs text-slate-500">Total Products</span>
          </div>
          <div className="font-bold text-xl text-slate-900">{products.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Boxes size={16} className="text-slate-400" />
            <span className="text-xs text-slate-500">Stock Value</span>
          </div>
          <div className="font-bold text-xl text-slate-900">{formatCurrency(totalStockValue)}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-xs text-slate-500">Potential Profit</span>
          </div>
          <div className="font-bold text-xl text-green-600">{formatCurrency(potentialProfit)}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-xs text-slate-500">Low Stock</span>
          </div>
          <div className="font-bold text-xl text-red-600">{lowStock.length}</div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-amber-600" />
            <span className="font-semibold text-amber-800 text-sm">Low Stock Alert</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <button
                key={p.id}
                onClick={() => { setRestockProductId(p.id); setRestockQty(''); }}
                className="text-xs px-3 py-1.5 bg-white rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
              >
                {p.name} ({p.stock} left)
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative max-w-xs mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stock Value</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{product.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{getCategoryLabel(product.category)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      'text-sm font-medium',
                      product.stock < 20 ? 'text-red-600' : product.stock < 50 ? 'text-amber-600' : 'text-slate-900'
                    )}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">{formatCurrency(product.stock * product.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setRestockProductId(product.id); setRestockQty(''); }}
                    >
                      <Plus size={14} /> Restock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Log */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Inventory Activity Log</h3>
        </div>
        <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
          {inventoryLogs.length === 0 ? (
            <EmptyState icon={<Boxes size={28} />} title="No inventory activity" />
          ) : (
            inventoryLogs.map(log => (
              <div key={log.id} className="flex items-center gap-3 p-4">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  log.action === 'restock' ? 'bg-green-100 text-green-600' :
                  log.action === 'sale' ? 'bg-blue-100 text-blue-600' :
                  'bg-amber-100 text-amber-600'
                )}>
                  {log.action === 'restock' ? <TrendingUp size={16} /> :
                   log.action === 'sale' ? <Package size={16} /> :
                   <AlertCircle size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900">{log.productName}</div>
                  <div className="text-xs text-slate-500">
                    {log.action} • {log.previousStock} → {log.newStock} • by {log.staffName}
                  </div>
                  <div className="text-xs text-slate-400">{formatDateTime(log.date)}</div>
                </div>
                <div className={cn(
                  'text-sm font-semibold',
                  log.action === 'restock' ? 'text-green-600' : 'text-slate-600'
                )}>
                  {log.action === 'restock' ? '+' : ''}{log.quantity}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Restock Modal */}
      <Modal
        open={!!restockProduct_id}
        onClose={() => setRestockProductId(null)}
        title="Restock Product"
        size="sm"
      >
        {(() => {
          const product = products.find(p => p.id === restockProduct_id);
          if (!product) return null;
          return (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="font-medium text-sm text-slate-900">{product.name}</div>
                <div className="text-xs text-slate-500">Current stock: {product.stock} {product.unit}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity to Add</label>
                <input
                  type="number"
                  value={restockQty}
                  onChange={e => setRestockQty(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setRestockProductId(null)}>Cancel</Button>
                <Button className="flex-1" onClick={handleRestock}>
                  <Plus size={16} /> Restock
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
