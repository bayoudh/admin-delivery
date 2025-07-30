"use client"
import { Analytics } from '@/components/Analytics';
import { CustomerManagement } from '@/components/CustomerManagement';
import { Dashboard } from '@/components/Dashboard';
import { DeliveryManagement } from '@/components/DeliveryManagement';
import { RestaurantManagement } from '@/components/RestaurantCMS/RestaurantManagement';
import { Sidebar } from '@/components/Sidebar';
import React, { useState } from 'react';


function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'restaurants':
        return <RestaurantManagement />;
      case 'deliveries':
        return <DeliveryManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">System settings and configuration options coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 ml-64">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;