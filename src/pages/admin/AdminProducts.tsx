import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, getCategoryLabel, getCategoryColor, cn } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import type { Product, ProductCategory } from '../../types';

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: 'school_supplies', label: 'School Supplies' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'household', label: 'Household' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' },
];

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toasts, addToast, removeToast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', description: '', category: 'school_supplies' as ProductCategory,
    price: '', costPrice: '', stock: '', unit: 'piece', image: '', featured: false,
  });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', category: 'school_supplies', price: '', costPrice: '', stock: '', unit: 'piece', image: '', featured: false });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name, description: product.description, category: product.category,
      price: String(product.price), costPrice: String(product.costPrice),
      stock: String(product.stock), unit: product.unit, image: product.image, featured: product.featured,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      addToast('error', 'Please fill in required fields');
      return;
    }
    const data = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: parseFloat(form.price) || 0,
      costPrice: parseFloat(form.costPrice) || 0,
      stock: parseInt(form.stock) || 0,
      unit: form.unit,
      image: form.image || `https://images.unsplash.com/photo-1589994965851-a8f479c573a3?w=400`,
      featured: form.featured,
      rating: editingProduct?.rating || 0,
      reviews: editingProduct?.reviews || 0,
      barcode: editingProduct?.barcode,
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      addToast('success', 'Product updated successfully');
    } else {
      addProduct(data);
      addToast('success', 'Product added successfully');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete);
      addToast('success', 'Product deleted');
      setConfirmDelete(null);
    }
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl">
          <EmptyState
            icon={<Package size={28} />}
            title="No products found"
            description="Add your first product to the catalog."
            action={<Button onClick={openAdd}><Plus size={16} /> Add Product</Button>}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-slate-900 line-clamp-1">{product.name}</div>
                          {product.featured && <span className="text-xs text-accent-600">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', getCategoryColor(product.category))}>
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm text-slate-900">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        'text-sm font-medium',
                        product.stock < 20 ? 'text-red-600' : 'text-slate-900'
                      )}>
                        {product.stock}
                      </span>
                      {product.stock < 20 && (
                        <AlertCircle size={12} className="inline ml-1 text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as ProductCategory })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
              <input
                type="text"
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (UGX) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price (UGX)</label>
              <input
                type="number"
                value={form.costPrice}
                onChange={e => setForm({ ...form, costPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <span className="text-sm text-slate-700">Feature this product on the homepage</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-slate-600 mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
