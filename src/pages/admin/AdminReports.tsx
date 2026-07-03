import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, getCategoryLabel } from '../../lib/utils';

export default function AdminReports() {
  const { orders, products, bookings } = useStore();

  // Revenue by category
  const categoryRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const cat = product ? getCategoryLabel(product.category) : 'Other';
        map[cat] = (map[cat] || 0) + item.price * item.quantity;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders, products]);

  // Order status distribution
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Monthly revenue (mock based on order dates)
  const monthlyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      const month = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short' });
      map[month] = (map[month] || 0) + o.total;
    });
    // Fill with sample data if too sparse
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => ({ month: m, revenue: map[m] || Math.floor(Math.random() * 500000) + 200000 }));
  }, [orders]);

  // Top products
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!map[item.productId]) map[item.productId] = { name: item.name, qty: 0, revenue: 0 };
        map[item.productId].qty += item.quantity;
        map[item.productId].revenue += item.price * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const bookingRevenue = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + b.price, 0);

  const pieColors = ['#1d61f0', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Booking Revenue', value: formatCurrency(bookingRevenue), icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-5">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                <Icon size={20} />
              </div>
              <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
              <div className="font-bold text-lg text-slate-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Line type="monotone" dataKey="revenue" stroke="#1d61f0" strokeWidth={2} dot={{ fill: '#1d61f0', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-white rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Revenue by Category</h3>
          {categoryRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {categoryRevenue.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">No data available</div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Order Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1d61f0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Top Selling Products</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {topProducts.length === 0 ? (
            <div className="px-5 py-12 text-center text-slate-400 text-sm">No sales data yet</div>
          ) : (
            topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900 truncate">{product.name}</div>
                  <div className="text-xs text-slate-500">{product.qty} units sold</div>
                </div>
                <div className="font-bold text-brand-600 text-sm">{formatCurrency(product.revenue)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
