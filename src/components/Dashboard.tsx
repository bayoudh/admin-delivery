import React from 'react';
import { StatCard } from './StatCard';
//import { mockDashboardStats } from '../utils/mockData';
import { DollarSign, Store, Truck, Users, TrendingUp, Clock, ShoppingBag, Star } from 'lucide-react';

export const Dashboard: React.FC = () => {
  //const stats = mockDashboardStats;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Revenue Stats */}
  {/*     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.totalRevenue.toLocaleString()}`}
          subtitle="All time"
          icon={DollarSign}
          trend={{ value: stats.revenue.revenueGrowth, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${stats.revenue.todayRevenue.toLocaleString()}`}
          subtitle="Last 24 hours"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={stats.revenue.orderCount.toLocaleString()}
          subtitle="All time"
          icon={ShoppingBag}
          color="purple"
        />
        <StatCard
          title="Average Order"
          value={`$${stats.revenue.averageOrderValue}`}
          subtitle="Per order"
          icon={DollarSign}
          color="amber"
        />
      </div>
 */}
      {/* Business Stats */}
     {/*  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Active Restaurants"
          value={`${stats.restaurants.active}/${stats.restaurants.total}`}
          subtitle="Currently operating"
          icon={Store}
          color="green"
        />
        <StatCard
          title="Active Deliveries"
          value={stats.deliveries.inProgress}
          subtitle={`${stats.deliveries.completed} completed today`}
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="Active Customers"
          value={stats.customers.active.toLocaleString()}
          subtitle={`+${stats.customers.newThisMonth} this month`}
          icon={Users}
          color="purple"
        />
      </div> */}

      {/* Top Performing Restaurants */}
  {/*     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Top Performing Restaurants</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
        </div>
        
        <div className="space-y-4">
          {stats.restaurants.topPerforming.map((restaurant, index) => (
            <div key={restaurant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.cuisine} • {restaurant.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${restaurant.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium text-gray-900">{restaurant.rating}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">{restaurant.deliveryTime}min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};