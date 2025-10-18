"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Filter, Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { driver } from "@/types/dashboard";
import Loading from "../../components/reaction/Loading";
import { useAuthStore } from "@/lib/store/auth";

export default function DriverPresonManagement() {
  const [driverList, setDriverList] = useState<driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore.getState().token;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "on_delivery" | "offline"
  >("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("api/admin/driver", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: driver[] = await res.json();
      setDriverList(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchDrivers();
  }, [token, fetchDrivers]);

  const filteredDrivers = driverList.filter((d) => {
    const matchesSearch = `${d.user_id.firstname} ${d.user_id.lastname} ${d.user_id.phone} ${d.vehicle_type} ${d.plate_number} ${d.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: "available" | "on_delivery" | "offline") => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "on_delivery":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
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
            Driver Management
          </h1>
          <p className="text-gray-600">
            Manage all registered drivers and their current delivery status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add driver
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or plate..."
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
              <option value="available">Available</option>
              <option value="on_delivery">On Delivery</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Driver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {d.user_id.firstname} {d.user_id.lastname}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {d.vehicle_type} — {d.plate_number}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      d.status
                    )}`}
                  >
                    {d.status}
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

              {/* Info Section */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {d.user_id.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {d.user_id.email}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && <Loading name="Driver" />}
      {loading && <Loading name="Driver" />}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
