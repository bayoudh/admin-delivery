"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Filter, Plus, Edit, Trash2, Phone, Mail, X } from "lucide-react";
import { driver } from "@/types/dashboard";
import Loading from "../../components/reaction/Loading";
import { useAuthStore } from "@/lib/store/auth";
import AddDriversPage from "./addDriverPreson";
import DeletePopup from "@/components/reaction/DeletePopup";
import { toast } from "react-toastify";
import UpdateDriverPage from "./updateDriver";

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

  // ✅ Edit modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // ✅ Delete popup states
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // ✅ Fetch drivers
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/driver", {
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

  // ✅ Handle delete driver
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/driver/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete driver");

      toast.success("Driver deleted successfully");
      setOpenDelete(false);
      fetchDrivers();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting driver");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter logic
  const filteredDrivers = driverList.filter((d) => {
    const matchesSearch = `${d.user_id?.firstname} ${d.user_id?.lastname} ${d.user_id?.phone} ${d.vehicle_type} ${d.plate_number} ${d.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ✅ Status color helper
  const getStatusColor = (status: "available" | "on_delivery" | "offline") => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "on_delivery":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Management</h1>
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

      {/* Add Driver Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-30 bg-gray-600/50 flex justify-center items-center">
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <AddDriversPage
              fetchDrivers={fetchDrivers}
              setIsAddOpen={setIsAddOpen}
              token={token}
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
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
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
            key={d.id || d.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {d.user_id?.firstname} {d.user_id?.lastname}
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
                  <button
                    onClick={() => {
                      setSelectedDriver(d.id);
                      setIsEditOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => {
                      setSelectedDeleteId(d.id);
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {d.user_id?.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {d.user_id?.email}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Edit Modal */}
      {isEditOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditOpen(false)}
            >
              ✕
            </button>
            <UpdateDriverPage
              driverId={selectedDriver}
              setIsEditOpen={setIsEditOpen}
              token={token}
              fetchDrivers={fetchDrivers}
            />
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {openDelete && selectedDeleteId && (
        <DeletePopup
          name="Driver"
          id={selectedDeleteId}
          onConfirm={handleDelete}
          onCancel={() => setOpenDelete(false)}
        />
      )}

      {loading && <Loading name="Driver" />}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
