"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Filter, Plus, Trash2, View } from "lucide-react";
import { DeliveryOrder } from "@/types/dashboard";
import Loading from "@/components/reaction/Loading";
import { useAuthStore } from "@/lib/store/auth";
import DeletePopup from "@/components/reaction/DeletePopup";
import { toast } from "react-toastify";
import Pagination from "@/components/reaction/Pagination";
import { useRouter } from "next/navigation";
import ViewOrderPopup from "./viewOrederDelivery";

export default function DeliveryOrdersManagement() {
  const [orderDeliverList, setOrderDeliverList] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "preparing" | "on_the_way" | "delivered" | "canceled"
  >("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const token = useAuthStore.getState().token;

  // ✅ Fetch delivery orders
  const fetchOrderDelivers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: DeliveryOrder[] = await res.json();
      setOrderDeliverList(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load delivery orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrderDelivers();
  }, [token, fetchOrderDelivers]);

  // ✅ Handle delete
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete order");

      toast.success("Order deleted successfully");
      setOpenDelete(false);
      fetchOrderDelivers();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting order");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle status change (PATCH)
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Find the order
      const order = orderDeliverList.find((o) => o.id === id);
      if (!order) return toast.error("Order not found");

      // Prevent changing canceled orders
      if (order.status === "canceled") {
        toast.warning("Cannot change status of a canceled order");
        return;
      }

      // Send PATCH request
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Order status updated to "${newStatus}"`);
      fetchOrderDelivers();
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  // ✅ Filter logic
  const filteredOrderDelivers = orderDeliverList.filter((order) => {
    const searchContent = `${order?.ref ?? ""} ${order?.driver_id?.user_id?.firstname ?? ""} ${
      order?.driver_id?.user_id?.lastname ?? ""
    } ${order?.restaurant_id?.name ?? ""} ${order?.customer_id?.firstname ?? ""} ${
      order?.customer_id?.lastname ?? ""
    } ${order?.customer_id?.phone ?? ""} ${order?.status ?? ""}`.toLowerCase();

    const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrderDelivers.length / entries);
  const displayed = filteredOrderDelivers.slice(
    (page - 1) * entries,
    page * entries
  );

  // ✅ Status color helper
  const getStatusColor = (
    status: "pending" | "preparing" | "on_the_way" | "delivered" | "canceled"
  ) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "on_the_way":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <Loading name={"Order Delivery"} />;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Delivery Orders</h1>
        <button
          type="button"
          onClick={() => router.push("deliveries/addorderdelivery")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Order Delivery
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ref, or status..."
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
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="on_the_way">On The Way</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries control */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-xl">Show</label>
          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded-lg px-2 py-1 text-xl"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span className="text-xl">Entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-xl">
              <th className="p-3 border-b">Reference</th>
              <th className="p-3 border-b">Restaurant</th>
              <th className="p-3 border-b">Driver</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Total Price</th>
              <th className="p-3 border-b">Payment Method</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors text-xl">
                <td className="p-3 border-b uppercase">{order.ref}</td>
                <td className="p-3 border-b uppercase">{order?.restaurant_id?.name}</td>
                <td className="p-3 border-b">
                  {order.driver_id?.user_id.firstname} {order.driver_id?.user_id?.lastname}
                </td>
                <td className="p-3 border-b">
                  {order.customer_id?.firstname} {order.customer_id?.lastname}
                </td>
                <td className="p-3 border-b">{order.total_price}</td>
                <td className="p-3 border-b">{order.payment_method}</td>

                {/* ✅ Editable Status Dropdown */}
                <td className="p-3 border-b">
               <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={
                      order.status === "delivered" || order.status === "canceled"
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "delivered" || order.status === "canceled"
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="on_the_way">On The Way</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>

                <td className="p-3 border-b text-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800"
                  onClick={() => {
                setSelectedOrder(order.id);
                setOpen(true);
              }}
              >
                    <View size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setSelectedDeleteId(order.id);
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrderDelivers.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500 text-sm">
                  No delivery orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        entries={entries}
        filtered={filteredOrderDelivers}
        setPage={setPage}
        totalPages={totalPages}
      />

      {/* Delete Popup */}
      {openDelete && selectedDeleteId && (
        <DeletePopup
          name="order"
          id={selectedDeleteId}
          onConfirm={handleDelete}
          onCancel={() => setOpenDelete(false)}
        />
      )}
      <ViewOrderPopup
        open={open}
        onClose={() => setOpen(false)}
        orderid={selectedOrder}
      />
    </div>
  );
}
