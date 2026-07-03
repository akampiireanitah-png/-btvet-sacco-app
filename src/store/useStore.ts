import { create } from 'zustand';
import type {
  User, Product, Service, Order, Booking,
  SaccoTransaction, Notification, InventoryLog, CartItem,
  OrderStatus, BookingStatus, PaymentMethod,
} from '../types';
import {
  mockUsers, mockProducts, mockServices, mockOrders,
  mockBookings, mockSaccoTransactions, mockNotifications,
  mockInventoryLogs, currentUserId,
} from '../data/mockData';

interface StoreState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (userId: string) => void;
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, qty: number, staffName: string) => void;

  // Services
  services: Service[];
  addService: (s: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  createOrder: (shippingAddress: string, paymentMethod: PaymentMethod, notes?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note: string) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (serviceId: string, date: string, time: string, notes?: string) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;

  // SACCO Transactions
  saccoTransactions: SaccoTransaction[];
  addSaccoTransaction: (t: Omit<SaccoTransaction, 'id'>) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Inventory Logs
  inventoryLogs: InventoryLog[];
  addInventoryLog: (log: Omit<InventoryLog, 'id'>) => void;

  // Computed
  getCartTotal: () => number;
  getCartCount: () => number;
  getUnreadNotifications: () => number;
}

let idCounter = 1000;
const genId = (prefix: string) => `${prefix}${++idCounter}`;
const genOrderNumber = () => `ORD-2024-${String(Date.now()).slice(-4)}`;
const genBookingNumber = () => `BKG-2024-${String(Date.now()).slice(-4)}`;
const genTxnRef = () => `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(idCounter).slice(-3)}`;

export const useStore = create<StoreState>((set, get) => ({
  // ===== Auth =====
  currentUser: mockUsers.find(u => u.id === currentUserId) || null,
  users: mockUsers,
  login: (userId) => {
    const user = get().users.find(u => u.id === userId);
    if (user) set({ currentUser: user });
  },
  logout: () => set({ currentUser: null, cart: [] }),

  // ===== Products =====
  products: mockProducts,
  addProduct: (p) => {
    const newProduct: Product = {
      ...p,
      id: genId('p'),
      createdAt: new Date().toISOString(),
    };
    set(state => ({ products: [newProduct, ...state.products] }));
  },
  updateProduct: (id, updates) => {
    set(state => ({
      products: state.products.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  },
  deleteProduct: (id) => {
    set(state => ({ products: state.products.filter(p => p.id !== id) }));
  },
  restockProduct: (id, qty, staffName) => {
    const product = get().products.find(p => p.id === id);
    if (!product) return;
    const newStock = product.stock + qty;
    set(state => ({
      products: state.products.map(p => p.id === id ? { ...p, stock: newStock } : p),
      inventoryLogs: [{
        id: genId('il'),
        productId: id,
        productName: product.name,
        action: 'restock',
        quantity: qty,
        previousStock: product.stock,
        newStock,
        date: new Date().toISOString(),
        staffName,
      }, ...state.inventoryLogs],
    }));
  },

  // ===== Services =====
  services: mockServices,
  addService: (s) => {
    const newService: Service = { ...s, id: genId('s') };
    set(state => ({ services: [newService, ...state.services] }));
  },
  updateService: (id, updates) => {
    set(state => ({
      services: state.services.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  },
  deleteService: (id) => {
    set(state => ({ services: state.services.filter(s => s.id !== id) }));
  },

  // ===== Cart =====
  cart: [],
  addToCart: (productId, qty = 1) => {
    const product = get().products.find(p => p.id === productId);
    if (!product) return;
    const existing = get().cart.find(c => c.productId === productId);
    if (existing) {
      set(state => ({
        cart: state.cart.map(c =>
          c.productId === productId ? { ...c, quantity: c.quantity + qty } : c
        ),
      }));
    } else {
      set(state => ({
        cart: [...state.cart, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image,
          unit: product.unit,
        }],
      }));
    }
  },
  removeFromCart: (productId) => {
    set(state => ({ cart: state.cart.filter(c => c.productId !== productId) }));
  },
  updateCartQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set(state => ({
      cart: state.cart.map(c => c.productId === productId ? { ...c, quantity: qty } : c),
    }));
  },
  clearCart: () => set({ cart: [] }),

  // ===== Orders =====
  orders: mockOrders,
  createOrder: (shippingAddress, paymentMethod, notes) => {
    const cart = get().cart;
    const user = get().currentUser!;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = genOrderNumber();
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: genId('o'),
      orderNumber,
      userId: user.id,
      userName: user.name,
      items: cart.map(c => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        unit: c.unit,
      })),
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
      shippingAddress,
      notes,
      createdAt: now,
      updatedAt: now,
      trackingHistory: [{ status: 'pending', timestamp: now, note: 'Order placed' }],
    };

    set(state => ({ orders: [newOrder, ...state.orders], cart: [] }));

    // Deduct from SACCO account if that payment method
    if (paymentMethod === 'sacco_account') {
      set(state => ({
        users: state.users.map(u =>
          u.id === user.id ? { ...u, saccoBalance: u.saccoBalance - total } : u
        ),
        currentUser: { ...user, saccoBalance: user.saccoBalance - total },
      }));
      get().addSaccoTransaction({
        userId: user.id,
        userName: user.name,
        type: 'purchase',
        amount: total,
        balanceAfter: user.saccoBalance - total,
        description: `Purchase: ${orderNumber}`,
        reference: genTxnRef(),
        date: now,
      });
    }

    // Deduct stock
    cart.forEach(item => {
      const product = get().products.find(p => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        set(state => ({
          products: state.products.map(p =>
            p.id === item.productId ? { ...p, stock: newStock } : p
          ),
          inventoryLogs: [{
            id: genId('il'),
            productId: item.productId,
            productName: item.name,
            action: 'sale',
            quantity: item.quantity,
            previousStock: product.stock,
            newStock,
            date: now,
            staffName: 'System',
          }, ...state.inventoryLogs],
        }));
      }
    });

    // Add notification
    get().addNotification({
      userId: user.id,
      title: 'Order Placed Successfully',
      message: `Your order ${orderNumber} has been placed. Total: UGX ${total.toLocaleString()}.`,
      type: 'order',
      read: false,
      createdAt: now,
    });

    return newOrder;
  },
  updateOrderStatus: (orderId, status, note) => {
    const now = new Date().toISOString();
    set(state => ({
      orders: state.orders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: now,
              trackingHistory: [...o.trackingHistory, { status, timestamp: now, note }],
            }
          : o
      ),
    }));

    const order = get().orders.find(o => o.id === orderId);
    if (order) {
      get().addNotification({
        userId: order.userId,
        title: 'Order Status Updated',
        message: `Your order ${order.orderNumber} is now ${status.replace('_', ' ')}. ${note}`,
        type: 'order',
        read: false,
        createdAt: now,
      });
    }
  },

  // ===== Bookings =====
  bookings: mockBookings,
  createBooking: (serviceId, date, time, notes) => {
    const service = get().services.find(s => s.id === serviceId);
    const user = get().currentUser!;
    if (!service) throw new Error('Service not found');

    const newBooking: Booking = {
      id: genId('b'),
      bookingNumber: genBookingNumber(),
      serviceId,
      serviceName: service.name,
      userId: user.id,
      userName: user.name,
      date,
      time,
      status: 'pending',
      price: service.price,
      notes,
      createdAt: new Date().toISOString(),
    };

    set(state => ({ bookings: [newBooking, ...state.bookings] }));

    get().addNotification({
      userId: user.id,
      title: 'Booking Created',
      message: `Your booking for ${service.name} on ${date} at ${time} is pending confirmation.`,
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString(),
    });

    return newBooking;
  },
  updateBookingStatus: (bookingId, status) => {
    set(state => ({
      bookings: state.bookings.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ),
    }));

    const booking = get().bookings.find(b => b.id === bookingId);
    if (booking) {
      get().addNotification({
        userId: booking.userId,
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your booking ${booking.bookingNumber} for ${booking.serviceName} has been ${status}.`,
        type: 'booking',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  },

  // ===== SACCO Transactions =====
  saccoTransactions: mockSaccoTransactions,
  addSaccoTransaction: (t) => {
    set(state => ({
      saccoTransactions: [{ ...t, id: genId('t') }, ...state.saccoTransactions],
    }));
  },

  // ===== Notifications =====
  notifications: mockNotifications,
  addNotification: (n) => {
    set(state => ({
      notifications: [{ ...n, id: genId('n') }, ...state.notifications],
    }));
  },
  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  },
  markAllNotificationsRead: () => {
    const uid = get().currentUser?.id;
    set(state => ({
      notifications: state.notifications.map(n =>
        n.userId === uid ? { ...n, read: true } : n
      ),
    }));
  },

  // ===== Inventory Logs =====
  inventoryLogs: mockInventoryLogs,
  addInventoryLog: (log) => {
    set(state => ({
      inventoryLogs: [{ ...log, id: genId('il') }, ...state.inventoryLogs],
    }));
  },

  // ===== Computed =====
  getCartTotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  getCartCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },
  getUnreadNotifications: () => {
    const uid = get().currentUser?.id;
    return get().notifications.filter(n => n.userId === uid && !n.read).length;
  },
}));
