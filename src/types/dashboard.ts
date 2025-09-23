import { LucideIcon } from "lucide-react";
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "customer" | "restaurant" | "driver";
}
export interface Category {
  id: string;
  name: string;
  }
  
export interface Restaurant {
  id: string;
  nom: string;
  adresse: string;
 
}

export interface Delivery {
  id: string;
  orderId: string;
  restaurantId: string;
  customerId: string;
  driverId: string;
  status: 'preparing' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  estimatedTime: number;
  actualTime?: number;
  distance: number;
  fee: number;
  createdAt: Date;
  deliveredAt?: Date;
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
  status: 'active' | 'inactive';
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
  url:string;
}