"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, Filter, Plus, Edit, Trash2, Phone, Mail, X ,User2Icon,} from "lucide-react";
import AddRestaurantPage from "./Addstore";
import { Restaurant } from "@/types/dashboard";
import Loading from "../reaction/Loading";
import { useAuthStore } from "@/lib/store/auth";

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore.getState().token;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/restaurant", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: Restaurant[] = await res.json();
      console.log("Restaurants:", data);
      setRestaurants(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = `${r.name} ${r.city} ${r.phone} ${r.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || (r.status || "active") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Store Management
          </h1>
          <p className="text-gray-600">
            Manage all registered stores and their performance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-30 bg-gray-600/50 flex justify-center items-center">
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <AddRestaurantPage
              token={token}
              fetchRestaurants={fetchRestaurants}
              setIsAddOpen={setIsAddOpen}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      {loading ? (
        <Loading name="store" />
      ) : filteredRestaurants.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No stores found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Top Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {restaurant.street && `${restaurant.street}, `}
                      {restaurant.city && `${restaurant.city}, `}
                      {restaurant.zipcode && `ZIP: ${restaurant.zipcode}`}
                      <br />
                      {restaurant.category_id?.name && (
                        <span className="text-blue-600 font-medium">
                          {restaurant.category_id.name}
                        </span>
                      )}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        restaurant.status || "active"
                      )}`}
                    >
                      {restaurant.status || "Active"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2">
                <div className="space-y-2 text-sm text-gray-700">
                  {restaurant.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                  {restaurant.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{restaurant.email}</span>
                    </div>
                  )}
                  </div>
                  {restaurant.user_id&&(
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center">
                      <User2Icon className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{restaurant.user_id.firstname} {restaurant.user_id.lastname}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{restaurant.user_id.phone}</span>
                    </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
}
