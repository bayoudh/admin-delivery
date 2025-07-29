import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Store, Truck, Calendar, Filter, Download } from 'lucide-react';
import { mockDashboardStats, mockRestaurants } from '../utils/mockData';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue');

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 1200, customers: 450 },
    { month: 'Feb', revenue: 52000, orders: 1350, customers: 480 },
    { month: 'Mar', revenue: 48000, orders: 1280, customers: 465 },
    { month: 'Apr', revenue: 61000, orders: 1580, customers: 520 },
    { month: 'May', revenue: 55000, orders: 1420, customers: 495 },
    { month: 'Jun', revenue: 67000, orders: 1680, customers: 580 },
    { month: 'Jul', revenue: 72000, orders: 1850, customers: 620 },
    { month: 'Aug', revenue: 69000, orders: 1750, customers: 595 },
    { month: 'Sep', revenue: 74000, orders: 1920, customers: 640 },
    { month: 'Oct', revenue: 78000, orders: 2050, customers: 675 },
    { month: 'Nov', revenue: 82000, orders: 2180, customers: 710 },
    { month: 'Dec', revenue: 89000, orders: 2350, customers: 780 },
  ];

  const topPerformingHours = [
    { hour: '11:00', orders: 45, revenue: 1250 },
    { hour: '12:00', orders: 78, revenue: 2100 },
    { hour: '13:00', orders: 65, revenue: 1800 },
    { hour: '18:00', orders: 92, revenue: 2650 },
    { hour: '19:00', orders: 88, revenue: 2400 },
    { hour: '20:00', orders: 72, revenue: 2000 },
    { hour: '21:00', orders: 56, revenue: 1550 },
  ];

  const cuisinePerformance = [
    { cuisine: 'Italian', orders: 2450, revenue: 89500, growth: 12.5 },
    { cuisine: 'Chinese', orders: 1980, revenue: 72300, growth: 8.2 },
    { cuisine: 'American', orders: 3200, revenue: 95600, growth: 15.8 },
    { cuisine: 'Japanese', orders: 1560, revenue: 78900, growth: -2.1 },
    { cuisine: 'Mexican', orders: 1890, revenue: 54200, growth: 6.7 },
  ];

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business insights and performance metrics.</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">$218,050</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">5,668</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+8.2%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900">1,089</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+15.3%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900">$38.45</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm font-medium text-red-600">-2.1%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'revenue'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSelectedMetric('orders')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'orders'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setSelectedMetric('customers')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'customers'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Customers
              </button>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.slice(-6).map((data, index) => {
              const value = data[selectedMetric];
              const maxValue = getMaxValue(revenueData, selectedMetric);
              const height = (value / maxValue) * 200;
              
              return (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div className="w-full flex items-end justify-center mb-2">
                    <div
                      className="bg-blue-500 rounded-t-lg w-full transition-all duration-500 hover:bg-blue-600 cursor-pointer"
                      style={{ height: `${height}px` }}
                      title={`${data.month}: ${selectedMetric === 'revenue' ? '$' : ''}${value.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Hours Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Peak Hours Analysis</h2>
          <div className="space-y-4">
            {topPerformingHours.map((hour, index) => {
              const maxOrders = Math.max(...topPerformingHours.map(h => h.orders));
              const percentage = (hour.orders / maxOrders) * 100;
              
              return (
                <div key={hour.hour} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 w-12">{hour.hour}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{hour.orders} orders</p>
                    <p className="text-xs text-gray-600">${hour.revenue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cuisine Performance & Restaurant Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cuisine Performance</h2>
          <div className="space-y-4">
            {cuisinePerformance.map((cuisine, index) => (
              <div key={cuisine.cuisine} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cuisine.cuisine}</h3>
                    <p className="text-sm text-gray-600">{cuisine.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${cuisine.revenue.toLocaleString()}</p>
                  <div className="flex items-center">
                    {cuisine.growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${cuisine.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cuisine.growth > 0 ? '+' : ''}{cuisine.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Performance</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-bold text-gray-900">31.5 min</p>
                  <p className="text-sm text-gray-600">Average Delivery Time</p>
                </div>
              </div>
              <div className="text-right">
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <span className="text-sm font-medium text-green-600">-5.2%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-bold text-gray-900">94.2%</p>
                  <p className="text-sm text-gray-600">On-Time Delivery Rate</p>
                </div>
              </div>
              <div className="text-right">
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <span className="text-sm font-medium text-green-600">+2.1%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-bold text-gray-900">$4.25</p>
                  <p className="text-sm text-gray-600">Average Delivery Fee</p>
                </div>
              </div>
              <div className="text-right">
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <span className="text-sm font-medium text-green-600">+1.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">68%</h3>
            <p className="text-sm text-gray-600">Customer Retention Rate</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+5.2%</span>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.2</h3>
            <p className="text-sm text-gray-600">Orders per Customer/Month</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+8.7%</span>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">$162</h3>
            <p className="text-sm text-gray-600">Customer Lifetime Value</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+12.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};