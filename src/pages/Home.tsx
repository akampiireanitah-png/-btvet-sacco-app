import { Link } from 'react-router-dom';
import {
  ShoppingBag, Calendar, Wallet, Package, TrendingUp,
  ArrowRight, Users, Award, Truck, ShieldCheck, BookOpen,
  Banknote, Printer, GraduationCap, PiggyBank, Monitor,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, getCategoryLabel, getCategoryColor } from '../lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Banknote, Printer, GraduationCap, TrendingUp, PiggyBank, Monitor,
};

export default function Home() {
  const { products, services, currentUser } = useStore();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  const features = [
    {
      icon: ShoppingBag,
      title: 'Shop Products',
      description: 'Browse and order school supplies, electronics, groceries, and more.',
      link: '/shop',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: Calendar,
      title: 'Book Services',
      description: 'Schedule appointments for loans, printing, training, and consultancy.',
      link: '/services',
      color: 'from-emerald-500 to-emerald-700',
    },
    {
      icon: Wallet,
      title: 'SACCO Account',
      description: 'Check your balance, savings, loans, and transaction history.',
      link: '/sacco',
      color: 'from-amber-500 to-amber-700',
    },
    {
      icon: Package,
      title: 'Track Orders',
      description: 'Monitor your orders from placement to delivery in real-time.',
      link: '/orders',
      color: 'from-purple-500 to-purple-700',
    },
  ];

  const stats = [
    { label: 'Active Members', value: '2,400+', icon: Users },
    { label: 'Products Available', value: `${products.length}+`, icon: ShoppingBag },
    { label: 'Services Offered', value: `${services.length}`, icon: Award },
    { label: 'Orders Fulfilled', value: '15,000+', icon: Truck },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
                <ShieldCheck size={16} /> Trusted BTVET Cooperative Platform
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Your One-Stop <br />
                <span className="text-accent-300">Business Centre</span>
              </h1>
              <p className="text-lg text-brand-100 mb-8 max-w-lg">
                Shop for quality goods, book professional services, and manage your SACCO finances — all in one place, built for BTVET teachers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 rounded-xl font-semibold hover:bg-brand-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Shopping <ArrowRight size={18} />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            {/* Welcome Card */}
            {currentUser && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Welcome, {currentUser.name.split(' ')[0]}!</div>
                    <div className="text-sm text-brand-200">{currentUser.memberNumber}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                    <span className="text-sm text-brand-100">SACCO Balance</span>
                    <span className="font-bold text-xl text-accent-300">{formatCurrency(currentUser.saccoBalance)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <div className="text-xs text-brand-200">Savings</div>
                      <div className="font-semibold text-sm">{formatCurrency(currentUser.saccoSavings)}</div>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl">
                      <div className="text-xs text-brand-200">Loan Balance</div>
                      <div className="font-semibold text-sm">{formatCurrency(currentUser.saccoLoanBalance)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-xl shadow-lg p-5 text-center hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-2">
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything You Need</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">A comprehensive platform serving all your shopping, service, and financial needs.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link
                key={i}
                to={feature.link}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{feature.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-slate-500 text-sm mt-1">Top picks from our catalog</p>
            </div>
            <Link to="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <Link
                key={product.id}
                to="/shop"
                className="group bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1 ${getCategoryColor(product.category)}`}>
                    {getCategoryLabel(product.category)}
                  </span>
                  <h3 className="font-medium text-sm text-slate-900 line-clamp-2 mb-2">{product.name}</h3>
                  <div className="font-bold text-brand-600">{formatCurrency(product.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Our Services</h2>
            <p className="text-slate-500 text-sm mt-1">Professional services for BTVET members</p>
          </div>
          <Link to="/services" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map(service => {
            const Icon = iconMap[service.icon] || BookOpen;
            return (
              <Link
                key={service.id}
                to="/services"
                className="group flex items-start gap-4 bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white flex-shrink-0">
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{service.duration}</span>
                    {service.price > 0 && (
                      <span className="text-sm font-semibold text-emerald-600">{formatCurrency(service.price)}</span>
                    )}
                    {service.price === 0 && (
                      <span className="text-sm font-semibold text-emerald-600">Free Consultation</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-accent-500 to-accent-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-accent-100 mb-6 max-w-xl mx-auto">
              Join thousands of BTVET teachers benefiting from our cooperative business platform.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent-700 rounded-xl font-semibold hover:bg-accent-50 transition-all shadow-lg"
            >
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
