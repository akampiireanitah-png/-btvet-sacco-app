export const formatCurrency = (amount: number): string => {
  return `UGX ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateStr);
};

export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    school_supplies: 'School Supplies',
    electronics: 'Electronics',
    groceries: 'Groceries',
    household: 'Household',
    office: 'Office',
    other: 'Other',
    financial: 'Financial Services',
    printing: 'Printing',
    training: 'Training',
    consultancy: 'Consultancy',
  };
  return labels[category] || category;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    school_supplies: 'bg-blue-100 text-blue-700',
    electronics: 'bg-purple-100 text-purple-700',
    groceries: 'bg-green-100 text-green-700',
    household: 'bg-orange-100 text-orange-700',
    office: 'bg-indigo-100 text-indigo-700',
    other: 'bg-gray-100 text-gray-700',
    financial: 'bg-emerald-100 text-emerald-700',
    printing: 'bg-cyan-100 text-cyan-700',
    training: 'bg-amber-100 text-amber-700',
    consultancy: 'bg-rose-100 text-rose-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

export const getOrderStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    processing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    mtn_momo: 'MTN Mobile Money',
    airtel_money: 'Airtel Money',
    sacco_account: 'SACCO Account',
    cash_on_delivery: 'Cash on Delivery',
  };
  return labels[method] || method;
};

export const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export const getTransactionTypeColor = (type: string): { bg: string; text: string; sign: string } => {
  const config: Record<string, { bg: string; text: string; sign: string }> = {
    deposit: { bg: 'bg-green-100', text: 'text-green-700', sign: '+' },
    withdrawal: { bg: 'bg-red-100', text: 'text-red-700', sign: '-' },
    loan_disbursement: { bg: 'bg-blue-100', text: 'text-blue-700', sign: '+' },
    loan_repayment: { bg: 'bg-orange-100', text: 'text-orange-700', sign: '-' },
    purchase: { bg: 'bg-purple-100', text: 'text-purple-700', sign: '-' },
    savings: { bg: 'bg-emerald-100', text: 'text-emerald-700', sign: '+' },
  };
  return config[type] || { bg: 'bg-gray-100', text: 'text-gray-700', sign: '' };
};

export const getTransactionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    loan_disbursement: 'Loan Disbursement',
    loan_repayment: 'Loan Repayment',
    purchase: 'Purchase',
    savings: 'Savings',
  };
  return labels[type] || type;
};

export const getBookingStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};
