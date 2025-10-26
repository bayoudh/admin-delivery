import { LucideIcon } from "lucide-react";
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: "customer" | "restaurant" | "driver";
}
export interface Category {
  id: string;
  name: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category_id: Category;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  zipcode?: string;
  status: "active" | "closed";
  restaurant_photo?: string;
  created_at: Date;
  user_id: User;
}
export interface driver {
  id: string;
  user_id: User;
  vehicle_type?: string;
  plate_number?: string;
  status: "available" | "on_delivery" | "offline";
  current_lat?: number;
  current_lng?: number;
  driver_photo?: string;
}

export interface DeliveryOrder {
  id: string;
  ref: string;
  restaurant_id: Restaurant;
  customer_id: User;
  driver_id: driver;
  total_price:number;
  status: "pending" | "preparing" | "on_the_way" | "delivered" | "canceled";
  payment_method: "cash" | "card";
  delivery_street?: string;
  delivery_city?: string;
  delivery_zipcode?: string;
  created_at: Date;
  updated_at: Date;
}
export interface OrderItem  {
  id:string;
  order_id: DeliveryOrder;
  product_id:Product;
  quantity: number;
  price: number;
}
export interface Product  {
  restaurant_id:Restaurant;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  product_photo?: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date;
  status: "active" | "inactive";
  joinedAt: Date;
}

export interface RevenueStats {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  revenueGrowth: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface DashboardStats {
  restaurants: {
    total: number;
    active: number;
    topPerforming: Restaurant[];
  };
  deliveries: {
    total: number;
    inProgress: number;
    completed: number;
    averageTime: number;
  };
  customers: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  revenue: RevenueStats;
}
export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  url: string;
}
