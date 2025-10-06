"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  X,
} from "lucide-react";

import { driver } from "@/types/dashboard";
import Loading from "../../../components/reaction/Loading";
import { useAuthStore } from "@/lib/store/auth";

export default function DriverManagement() {
  const [driver, setdriver] = useState<driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const fetchdriver = async () => {
    try {
      setLoading(true);

      const res = await fetch("api/admin/driver", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: driver[] = await res.json();
      console.log("driver:", data);
      setdriver(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load driver");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchdriver();
  }, []);
   const filtereddriver = driver.filter((u) =>
    `${u.user_id.firstname} ${u.user_id.lastname} ${u.user_id.phone} ${u.vehicle_type}  ${u.plate_number}  ${u.status} ${u.driver_photo}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
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
            Manage all registered driver and their performance.
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
              placeholder="Search by name..."
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
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* driver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtereddriver.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {driver.user_id.firstname}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {driver.plate_number}  {driver.driver_photo} {driver.status}
                  </p>
                  {/* Temporary fake status until API returns it */}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      "active"
                    )}`}
                  >
                    {driver.status}
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

              {/* Info Section (fake data until API sends real) */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {driver.user_id.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                   {driver.user_id.email}
                </div>
              </div>

          
            </div>
          </div>
        ))}
      </div>

      {loading && <Loading name="Driver"/>}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
