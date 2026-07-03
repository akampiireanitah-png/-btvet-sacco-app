import { useState } from 'react';
import { Search, Users, Wallet, PiggyBank, Banknote } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, cn } from '../../lib/utils';
import EmptyState from '../../components/ui/EmptyState';

const roleColors: Record<string, string> = {
  member: 'bg-blue-100 text-blue-700',
  staff: 'bg-purple-100 text-purple-700',
  admin: 'bg-accent-100 text-accent-700',
};

export default function AdminMembers() {
  const { users } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false;
    if (search) {
      return u.name.toLowerCase().includes(search.toLowerCase()) ||
             u.email.toLowerCase().includes(search.toLowerCase()) ||
             u.memberNumber.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const totalSavings = users.reduce((sum, u) => sum + u.saccoSavings, 0);
  const totalLoans = users.reduce((sum, u) => sum + u.saccoLoanBalance, 0);
  const totalBalances = users.reduce((sum, u) => sum + u.saccoBalance, 0);

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-slate-400" />
            <span className="text-xs text-slate-500">Total Members</span>
          </div>
          <div className="font-bold text-xl text-slate-900">{users.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-brand-500" />
            <span className="text-xs text-slate-500">Total Balances</span>
          </div>
          <div className="font-bold text-xl text-slate-900">{formatCurrency(totalBalances)}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank size={16} className="text-green-500" />
            <span className="text-xs text-slate-500">Total Savings</span>
          </div>
          <div className="font-bold text-xl text-green-600">{formatCurrency(totalSavings)}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Banknote size={16} className="text-orange-500" />
            <span className="text-xs text-slate-500">Outstanding Loans</span>
          </div>
          <div className="font-bold text-xl text-orange-600">{formatCurrency(totalLoans)}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'member', 'staff', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors',
                filter === role
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl">
          <EmptyState icon={<Users size={28} />} title="No members found" />
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Balance</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Savings</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Loan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(user => {
                  return (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.memberNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-700">{user.email}</div>
                        <div className="text-xs text-slate-400">{user.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', roleColors[user.role])}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">{formatCurrency(user.saccoBalance)}</td>
                      <td className="px-4 py-3 text-right text-sm text-green-600 font-medium">{formatCurrency(user.saccoSavings)}</td>
                      <td className="px-4 py-3 text-right text-sm text-orange-600 font-medium">{formatCurrency(user.saccoLoanBalance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
