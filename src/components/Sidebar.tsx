"use client";
import React, {useState } from "react";
import { useAuthStore } from "../lib/store/auth";
import {
  BarChart3,
  Home,
  LogOut,
  Settings,
  Store,
  Truck,
  UserPen,
  Users,
  CheckLine
} from "lucide-react";
import { MenuItem } from "../types/dashboard";
import {  useRouter } from "next/navigation";
const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, url: "/dashboard" },
  { id: "Users", label: "Users", icon: Users, url: "/users" },
  { id: "Catogory Store", label: "Catogory Store", icon: CheckLine, url: "/catogory-store" },
  { id: "Store", label: "Store", icon: Store, url: "/store" },
  { id: "deliveries", label: "Deliveries", icon: Truck, url: "/deliveries" },
  {
    id: "delivery-person",
    label: "Delivery person",
    icon: UserPen,
    url: "/delivery-preson",
  },
  { id: "customers", label: "Customers", icon: Users, url: "/customers" },
  { id: "analytics", label: "Analytics", icon: BarChart3, url: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, url: "/settings" },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("");


  function gonav(item: MenuItem) {
    setActiveSection(item.id);
    router.push(`${item.url}`);
  }
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = async () => {
  try {
  
     logout();
    router.push("/");
  } catch (err) {
    console.error("Logout failed", err);
  }
};

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">DeliveryHub</h1>
        <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => gonav(item)} // fixed here
              className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-left transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 mr-3" />

          {/* You can use a logout icon here */}
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};
