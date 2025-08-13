"use client"
import React, { useEffect, useState } from "react";
import { BarChart3, Home, Settings, Store, Truck, UserPen, Users } from "lucide-react";
import  {MenuItem}  from '../types/dashboard';
import { usePathname, useRouter  } from "next/navigation";
const menuItems:MenuItem[]  = [
  { id: "dashboard", label: "Dashboard", icon: Home ,url:'/dashboard'},
  { id: "restaurants", label: "Restaurants", icon: Store,url:'/restaurant'},
  { id: "deliveries", label: "Deliveries", icon: Truck ,url:'/deliveries'},
  { id: "delivery-person", label: "Delivery person", icon: UserPen ,url:'/delivery-person' },
  { id: "customers", label: "Customers", icon: Users ,url:'/customers'},
  { id: "analytics", label: "Analytics", icon: BarChart3 ,url:'/analytics'},
  { id: "settings", label: "Settings", icon: Settings ,url:'/settings'},
];

export const Sidebar: React.FC = () => {
   const router = useRouter();
    const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("dashboard");
   // Sync activeSection with current route on mount and route change
 useEffect(() => {
    const currentItem = menuItems.find(item => item.url === pathname);
    if (currentItem) {
      setActiveSection(currentItem.id);
    }
  }, [pathname]);
  function gonav(item:MenuItem){
    setActiveSection(item.id)
     router.push(`${item.url}`);
  } 
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">RestaurantHub</h1>
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
      </nav>
    </div>
  );
};
