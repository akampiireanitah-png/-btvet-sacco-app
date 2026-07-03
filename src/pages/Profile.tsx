import {
  User as UserIcon, Mail, Phone, MapPin, Building2, Calendar,
  Wallet, PiggyBank, Banknote, Shield, Edit,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../lib/utils';

export default function Profile() {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  const infoItems = [
    { icon: UserIcon, label: 'Full Name', value: currentUser.name },
    { icon: Mail, label: 'Email', value: currentUser.email },
    { icon: Phone, label: 'Phone', value: currentUser.phone },
    { icon: Building2, label: 'Institution', value: currentUser.institution },
    { icon: MapPin, label: 'Address', value: currentUser.address || 'Not provided' },
    { icon: Calendar, label: 'Member Since', value: formatDate(currentUser.joinDate) },
  ];

  const accounts = [
    { icon: Wallet, label: 'Account Balance', value: formatCurrency(currentUser.saccoBalance), color: 'text-brand-600', bg: 'bg-brand-50' },
    { icon: PiggyBank, label: 'Total Savings', value: formatCurrency(currentUser.saccoSavings), color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Banknote, label: 'Loan Balance', value: formatCurrency(currentUser.saccoLoanBalance), color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <p className="text-brand-100 text-sm">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 font-medium capitalize flex items-center gap-1">
                  <Shield size={12} /> {currentUser.role}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 font-medium">
                  {currentUser.memberNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {accounts.map((acc, i) => {
            const Icon = acc.icon;
            return (
              <div key={i} className="bg-white rounded-xl p-5">
                <div className={`w-10 h-10 rounded-lg ${acc.bg} flex items-center justify-center ${acc.color} mb-3`}>
                  <Icon size={20} />
                </div>
                <div className="text-sm text-slate-500 mb-1">{acc.label}</div>
                <div className={`font-bold text-lg ${acc.color}`}>{acc.value}</div>
              </div>
            );
          })}
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Personal Information</h3>
            <button className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
              <Edit size={14} /> Edit
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {infoItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                    <div className="font-medium text-slate-900">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
