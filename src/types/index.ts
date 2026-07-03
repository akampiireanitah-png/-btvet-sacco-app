// ===== Core Types =====

export type UserRole = 'member' | 'staff' | 'admin';
export type ProductCategory = 'school_supplies' | 'electronics' | 'groceries' | 'household' | 'office' | 'other';
export type ServiceCategory = 'financial' | 'printing' | 'training' | 'consultancy' | 'other';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'sacco_account' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type TransactionType = 'deposit' | 'withdrawal' | 'loan_disbursement' | 'loan_repayment' | 'purchase' | 'savings';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  memberNumber: string;
  saccoBalance: number;
  saccoSavings: number;
  saccoLoanBalance: number;
  joinDate: string;
  institution: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  unit: string;
  image: string;
  featured: boolean;
  rating: number;
  reviews: number;
  barcode?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: string;
  icon: string;
  availableSlots: AvailableSlot[];
  active: boolean;
}

export interface AvailableSlot {
  date: string;
  times: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  trackingHistory: TrackingEvent[];
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  notes?: string;
  createdAt: string;
}

export interface SaccoTransaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  reference: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'booking' | 'payment' | 'sacco' | 'system';
  read: boolean;
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  action: 'restock' | 'sale' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  date: string;
  staffName: string;
}
