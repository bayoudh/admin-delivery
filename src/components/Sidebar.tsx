"use client";

import React, { useState } from "react";
import { useAuthStore } from "../lib/store/auth";
import {
  Home,
  LogOut,
  Store,
  Truck,
  UserPen,
  Users,
  Check,
  Menu,
  X,
} from "lucide-react";
import { MenuItem } from "../types/dashboard";
import { useRouter } from "next/navigation";

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, url: "/dashboard" },
  { id: "users", label: "Users", icon: Users, url: "/users" },
  { id: "category-store", label: "Category Store", icon: Check, url: "/category-store" },
  { id: "store", label: "Store", icon: Store, url: "/store" },
  { id: "delivery-person", label: "Delivery Person", icon: UserPen, url: "/delivery-person" },
  { id: "customers", label: "Customers", icon: Users, url: "/customers" },
  { id: "deliveries", label: "Deliveries", icon: Truck, url: "/deliveries" },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const gonav = (item: MenuItem) => {
    setActiveSection(item.id);
    router.push(item.url);
    setIsOpen(false); // close sidebar on mobile after navigation
  };

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
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-bold text-gray-800">DeliveryHub</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg flex flex-col transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header (desktop only) */}
        <div className="hidden lg:block p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">DeliveryHub</h1>
          <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-grow justify-between overflow-y-auto">
          {/* Menu items */}
          <div className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => gonav(item)}
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
          </div>

          {/* Logout button */}
          <div className="border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-left transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
