import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Bell, User as UserIcon, Menu, X,
  LogOut, ChevronDown, Wallet, Shield, Store,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency, cn } from '../../lib/utils';

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, getCartCount, getUnreadNotifications, logout, markAllNotificationsRead, markNotificationRead, notifications } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const cartCount = getCartCount();
  const unreadCount = getUnreadNotifications();
  const userNotifs = notifications.filter(n => n.userId === currentUser?.id).slice(0, 10);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/services', label: 'Services' },
    { to: '/orders', label: 'My Orders' },
    { to: '/sacco', label: 'SACCO' },
  ];

  const adminLinks = currentUser?.role === 'admin' || currentUser?.role === 'staff' ? [
    { to: '/admin', label: 'Dashboard' },
  ] : [];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-lg shadow-md">
              BS
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-slate-900 text-sm leading-tight">BTVET Teachers</div>
              <div className="text-xs text-slate-500 leading-tight">SACCO Business Centre</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {adminLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-accent-600 hover:bg-accent-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <Shield size={15} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead()}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {userNotifs.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-400 text-sm">No notifications</div>
                    ) : (
                      userNotifs.map(n => (
                        <button
                          key={n.id}
                          onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                          className={cn(
                            "w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors",
                            !n.read && "bg-brand-50/50"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />}
                            <div className={cn("flex-1", n.read && "ml-4")}>
                              <div className="font-medium text-sm text-slate-900">{n.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{n.message}</div>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pr-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold">
                  {currentUser?.name.charAt(0)}
                </div>
                <ChevronDown size={16} className="hidden sm:block" />
              </button>

              {userMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="font-semibold text-slate-900">{currentUser.name}</div>
                    <div className="text-xs text-slate-500">{currentUser.email}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
                        {currentUser.role}
                      </span>
                      <span className="text-xs text-slate-400">{currentUser.memberNumber}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">SACCO Balance</span>
                      <span className="font-semibold text-brand-600">{formatCurrency(currentUser.saccoBalance)}</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/sacco"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Wallet size={16} /> SACCO Account
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon size={16} /> My Profile
                    </Link>
                    {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Store size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-3 border-t border-slate-200 animate-fadeIn">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {adminLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-accent-600 hover:bg-accent-50 rounded-lg"
              >
                <Shield size={16} /> {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
