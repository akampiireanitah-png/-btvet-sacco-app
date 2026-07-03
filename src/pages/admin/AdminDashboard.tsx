import { useState } from 'react';
import {
  LayoutDashboard, Package, Calendar, Users, BarChart3,
  Boxes, Wallet, TrendingUp, TrendingDown,
  ShoppingCart, Clock, AlertCircle,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, cn } from '../../lib/utils';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminBookings from './AdminBookings';
import AdminInventory from './AdminInventory';
import AdminReports from './AdminReports';
import AdminMembers from './AdminMembers';

type Tab = 'overview' | 'products' | 'orders' | 'bookings' | 'inventory' | 'members' | 'reports';

const tabs: { value: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'products', label: 'Products', icon: Package },
  { value: 'orders', label: 'Orders', icon: ShoppingCart },
  { value: 'bookings', label: 'Bookings', icon: Calendar },
  { value: 'inventory', label: 'Inventory', icon: Boxes },
  { value: 'members', label: 'Members', icon: Users },
  { value: 'reports', label: 'Reports', icon: BarChart3 },
];

export default function AdminDashboard() {
  const { products, orders, bookings, users, inventoryLogs } = useStore();
  const [tab, setTab] = useState<Tab>('overview');

  // Overview stats
  const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activeBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;
  const lowStockProducts = products.filter(p => p.stock < 20).length;
  const totalProducts = products.length;
  const totalMembers = users.length;

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: Wallet,
      color: 'from-brand-500 to-brand-700',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'from-amber-500 to-amber-700',
      trend: 'Needs attention',
      trendUp: false,
    },
    {
      label: 'Active Bookings',
      value: activeBookings,
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-700',
      trend: '+3 today',
      trendUp: true,
    },
    {
      label: 'Low Stock Items',
      value: lowStockProducts,
      icon: AlertCircle,
      color: 'from-red-500 to-red-700',
      trend: 'Restock needed',
      trendUp: false,
    },
  ];

  const recentOrders = [...orders].slice(0, 5);
  const recentInventory = [...inventoryLogs].slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mb-6">Manage products, orders, bookings, inventory, and more.</p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  tab === t.value
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                )}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-lg`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                    </div>
                    <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold mb-2">{stat.value}</div>
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {stat.trend}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{totalProducts}</div>
                <div className="text-xs text-slate-500">Total Products</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{orders.length}</div>
                <div className="text-xs text-slate-500">Total Orders</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{bookings.length}</div>
                <div className="text-xs text-slate-500">Total Bookings</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{totalMembers}</div>
                <div className="text-xs text-slate-500">Members</div>
              </div>
            </div>

            {/* Recent Orders & Inventory */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Recent Orders</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium text-sm text-slate-900">{order.orderNumber}</div>
                        <div className="text-xs text-slate-500">{order.userName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-slate-900">{formatCurrency(order.total)}</div>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        )}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inventory */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Inventory Activity</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {recentInventory.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          log.action === 'restock' ? 'bg-green-100 text-green-600' :
                          log.action === 'sale' ? 'bg-blue-100 text-blue-600' :
                          'bg-amber-100 text-amber-600'
                        )}>
                          {log.action === 'restock' ? <TrendingUp size={16} /> :
                           log.action === 'sale' ? <ShoppingCart size={16} /> :
                           <Boxes size={16} />}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-slate-900">{log.productName}</div>
                          <div className="text-xs text-slate-500 capitalize">{log.action} • by {log.staffName}</div>
                        </div>
                      </div>
                      <div className={cn(
                        'text-sm font-semibold',
                        log.action === 'restock' ? 'text-green-600' : 'text-slate-600'
                      )}>
                        {log.action === 'restock' ? '+' : '-'}{log.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && <AdminProducts />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'bookings' && <AdminBookings />}
        {tab === 'inventory' && <AdminInventory />}
        {tab === 'members' && <AdminMembers />}
        {tab === 'reports' && <AdminReports />}
      </div>
    </div>
  );
}
