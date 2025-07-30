import React, { useState } from 'react';
import { mockDeliveries } from '@/utils/mockData';
import { Delivery } from '@/types/dashboard';
import { Search, Filter, Clock, MapPin, Package, Truck } from 'lucide-react';

export const DeliveryManagement: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'preparing' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'>('all');

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-amber-100 text-amber-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return Package;
      case 'picked_up': return Truck;
      case 'in_transit': return MapPin;
      case 'delivered': return Clock;
      default: return Package;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Management</h1>
        <p className="text-gray-600">Track and manage all delivery orders in real-time.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">133</p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">31.5</p>
              <p className="text-sm text-gray-600">Avg Time (min)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">2.1</p>
              <p className="text-sm text-gray-600">Avg Distance (km)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="preparing">Preparing</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delivery List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Deliveries</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDeliveries.map((delivery) => {
            const StatusIcon = getStatusIcon(delivery.status);
            return (
              <div key={delivery.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(delivery.status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{delivery.orderId}</h3>
                      <p className="text-sm text-gray-600">Driver: {delivery.driverId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{delivery.distance} km</p>
                      <p className="text-xs text-gray-600">Distance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${delivery.fee}</p>
                      <p className="text-xs text-gray-600">Fee</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{delivery.estimatedTime}min</p>
                      <p className="text-xs text-gray-600">Est. Time</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace('_', ' ').charAt(0).toUpperCase() + delivery.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <p>Created: {delivery.createdAt.toLocaleString()}</p>
                  {delivery.deliveredAt && (
                    <p>Delivered: {delivery.deliveredAt.toLocaleString()}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};