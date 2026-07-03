import { useState } from 'react';
import {
  Wallet, PiggyBank, Banknote,
  ArrowDownLeft, ArrowUpRight,
  Download, Plus, Minus,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  formatCurrency, formatDate, formatRelativeTime,
  getTransactionTypeColor, getTransactionTypeLabel, cn,
} from '../lib/utils';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function Sacco() {
  const { currentUser, saccoTransactions, addSaccoTransaction } = useStore();
  const [filterType, setFilterType] = useState('all');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const userTxns = saccoTransactions.filter(t => t.userId === currentUser?.id);
  const filteredTxns = filterType === 'all' ? userTxns : userTxns.filter(t => t.type === filterType);

  const txnTypes = [
    { value: 'all', label: 'All' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'savings', label: 'Savings' },
    { value: 'loan_disbursement', label: 'Loans' },
    { value: 'purchase', label: 'Purchases' },
  ];

  const handleTransaction = (type: 'deposit' | 'withdrawal') => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    const newBalance = type === 'deposit'
      ? (currentUser?.saccoBalance || 0) + amt
      : (currentUser?.saccoBalance || 0) - amt;

    if (type === 'withdrawal' && newBalance < 0) return;

    addSaccoTransaction({
      userId: currentUser!.id,
      userName: currentUser!.name,
      type,
      amount: amt,
      balanceAfter: newBalance,
      description: description || (type === 'deposit' ? 'Account deposit' : 'Account withdrawal'),
      reference: `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 999)}`,
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
    if (type === 'deposit') setShowDepositModal(false);
    else setShowWithdrawModal(false);
  };

  const cards = [
    {
      label: 'Account Balance',
      value: currentUser?.saccoBalance || 0,
      icon: Wallet,
      color: 'from-brand-500 to-brand-700',
      subtitle: 'Available for spending',
    },
    {
      label: 'Total Savings',
      value: currentUser?.saccoSavings || 0,
      icon: PiggyBank,
      color: 'from-emerald-500 to-emerald-700',
      subtitle: 'Accumulated savings',
    },
    {
      label: 'Loan Balance',
      value: currentUser?.saccoLoanBalance || 0,
      icon: Banknote,
      color: 'from-orange-500 to-orange-700',
      subtitle: 'Outstanding loans',
    },
  ];

  // Summary stats
  const totalDeposits = userTxns.filter(t => t.type === 'deposit' || t.type === 'loan_disbursement' || t.type === 'savings').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = userTxns.filter(t => t.type === 'withdrawal' || t.type === 'loan_repayment' || t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">SACCO Account</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your savings, loans, and transactions.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowDepositModal(true)}>
              <Plus size={16} /> Deposit
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowWithdrawModal(true)}>
              <Minus size={16} /> Withdraw
            </Button>
          </div>
        </div>

        {/* Account Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="text-sm opacity-90 mb-1">{card.label}</div>
                <div className="text-2xl font-bold mb-1">{formatCurrency(card.value)}</div>
                <div className="text-xs opacity-75">{card.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <ArrowDownLeft size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Inflows</div>
              <div className="text-xl font-bold text-slate-900">{formatCurrency(totalDeposits)}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Outflows</div>
              <div className="text-xl font-bold text-slate-900">{formatCurrency(totalWithdrawals)}</div>
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="bg-white rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Membership Details</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Member Number</div>
              <div className="font-medium text-slate-900">{currentUser?.memberNumber}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Institution</div>
              <div className="font-medium text-slate-900">{currentUser?.institution}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Join Date</div>
              <div className="font-medium text-slate-900">{formatDate(currentUser?.joinDate || '')}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Role</div>
              <div className="font-medium text-slate-900 capitalize">{currentUser?.role}</div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Transaction History</h3>
            <button className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <Download size={15} /> Export
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-2 p-4 border-b border-slate-50 overflow-x-auto no-scrollbar">
            {txnTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setFilterType(t.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                  filterType === t.value
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Transactions */}
          <div className="divide-y divide-slate-50">
            {filteredTxns.length === 0 ? (
              <div className="px-5 py-12 text-center text-slate-400 text-sm">
                No transactions found.
              </div>
            ) : (
              filteredTxns.map(txn => {
                const config = getTransactionTypeColor(txn.type);
                const isInflow = ['deposit', 'loan_disbursement', 'savings'].includes(txn.type);
                return (
                  <div key={txn.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bg, config.text)}>
                      {isInflow ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-900">{getTransactionTypeLabel(txn.type)}</div>
                      <div className="text-xs text-slate-500 truncate">{txn.description}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {formatRelativeTime(txn.date)} • {txn.reference}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn('font-bold text-sm', isInflow ? 'text-green-600' : 'text-red-600')}>
                        {config.sign}{formatCurrency(txn.amount)}
                      </div>
                      <div className="text-xs text-slate-400">Bal: {formatCurrency(txn.balanceAfter)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal
        open={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Deposit Funds"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (UGX)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g., Monthly salary deposit"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDepositModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={() => handleTransaction('deposit')}>
              <Plus size={16} /> Deposit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        open={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Funds"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-brand-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Available Balance</div>
            <div className="font-bold text-brand-600">{formatCurrency(currentUser?.saccoBalance || 0)}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (UGX)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g., ATM withdrawal"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowWithdrawModal(false)}>Cancel</Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => handleTransaction('withdrawal')}
              disabled={parseFloat(amount) > (currentUser?.saccoBalance || 0)}
            >
              <Minus size={16} /> Withdraw
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
