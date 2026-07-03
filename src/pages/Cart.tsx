import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft,
  CheckCircle, CreditCard, Smartphone, Wallet, Banknote,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, getPaymentMethodLabel, cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import type { PaymentMethod } from '../types';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartQty, removeFromCart, clearCart, getCartTotal, createOrder, currentUser } = useStore();
  const { toasts, addToast, removeToast } = useToast();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sacco_account');
  const [notes, setNotes] = useState('');
  const [completedOrderNumber, setCompletedOrderNumber] = useState('');

  const total = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!shippingAddress.trim()) {
      addToast('error', 'Please enter a shipping address');
      return;
    }
    const order = createOrder(shippingAddress, paymentMethod, notes || undefined);
    setCompletedOrderNumber(order.orderNumber);
    setStep('success');
    addToast('success', `Order ${order.orderNumber} placed successfully!`);
  };

  const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard; description: string }[] = [
    { value: 'sacco_account', label: 'SACCO Account', icon: Wallet, description: `Balance: ${formatCurrency(currentUser?.saccoBalance || 0)}` },
    { value: 'mtn_momo', label: 'MTN Mobile Money', icon: Smartphone, description: 'Pay via MTN MoMo' },
    { value: 'airtel_money', label: 'Airtel Money', icon: Smartphone, description: 'Pay via Airtel Money' },
    { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
  ];

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-1">Your order has been placed successfully.</p>
          <p className="font-semibold text-brand-600 text-lg mb-6">{completedOrderNumber}</p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Total Amount</span>
              <span className="font-bold text-slate-900">{formatCurrency(total)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Payment Method</span>
              <span className="font-medium text-slate-900">{getPaymentMethodLabel(paymentMethod)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <span className="font-medium text-amber-600">Pending Confirmation</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
            <Button className="flex-1" onClick={() => navigate('/orders')}>
              Track Order <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {step === 'cart' ? 'Shopping Cart' : 'Checkout'}
        </h1>

        {cart.length === 0 && step === 'cart' ? (
          <div className="bg-white rounded-2xl shadow-sm">
            <EmptyState
              icon={<ShoppingCart size={28} />}
              title="Your cart is empty"
              description="Browse our products and add items to your cart."
              action={
                <Link to="/shop">
                  <Button>Start Shopping <ArrowRight size={16} /></Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Cart Items / Checkout Form */}
            <div className="lg:col-span-2 space-y-4">
              {step === 'cart' && (
                <>
                  {cart.map(item => (
                    <div key={item.productId} className="bg-white rounded-xl p-4 flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-slate-500">{formatCurrency(item.price)} / {item.unit}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                            <button
                              onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear cart
                  </button>
                </>
              )}

              {step === 'checkout' && (
                <div className="space-y-4">
                  {/* Shipping Address */}
                  <div className="bg-white rounded-xl p-5">
                    <h3 className="font-semibold text-slate-900 mb-3">Shipping Address</h3>
                    <textarea
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      rows={2}
                      placeholder="Enter your delivery address..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-xl p-5">
                    <h3 className="font-semibold text-slate-900 mb-3">Payment Method</h3>
                    <div className="space-y-2">
                      {paymentMethods.map(pm => {
                        const Icon = pm.icon;
                        const insufficientFunds = pm.value === 'sacco_account' && (currentUser?.saccoBalance || 0) < total;
                        return (
                          <button
                            key={pm.value}
                            onClick={() => setPaymentMethod(pm.value)}
                            disabled={insufficientFunds}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                              paymentMethod === pm.value
                                ? 'border-brand-500 bg-brand-50'
                                : 'border-slate-200 hover:border-brand-300',
                              insufficientFunds && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            <div className={cn(
                              'w-10 h-10 rounded-lg flex items-center justify-center',
                              paymentMethod === pm.value ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'
                            )}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 text-sm">{pm.label}</div>
                              <div className="text-xs text-slate-500">{pm.description}</div>
                              {insufficientFunds && (
                                <div className="text-xs text-red-500 mt-0.5">Insufficient balance</div>
                              )}
                            </div>
                            <div className={cn(
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                              paymentMethod === pm.value ? 'border-brand-500 bg-brand-500' : 'border-slate-300'
                            )}>
                              {paymentMethod === pm.value && <CheckCircle size={12} className="text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-xl p-5">
                    <h3 className="font-semibold text-slate-900 mb-3">Order Notes (optional)</h3>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Any special instructions for your order..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-5 sticky top-20">
                <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Items ({itemCount})</span>
                    <span className="font-medium text-slate-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-lg text-brand-600">{formatCurrency(total)}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <Button className="w-full" onClick={() => setStep('checkout')}>
                    Proceed to Checkout <ArrowRight size={16} />
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" onClick={handleCheckout}>
                      Place Order <CheckCircle size={16} />
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setStep('cart')}>
                      <ArrowLeft size={16} /> Back to Cart
                    </Button>
                  </div>
                )}

                <Link to="/shop" className="block text-center text-sm text-brand-600 hover:text-brand-700 mt-3">
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
