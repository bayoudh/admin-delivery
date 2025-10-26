"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { DeliveryOrder } from "@/types/dashboard";
import Loading from "./reaction/Loading";

interface RevenueItem {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

export const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "orders" | "customers"
  >("revenue");

  const token = useAuthStore.getState().token;

  // ✅ useCallback prevents the missing dependency warning
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedOrders: DeliveryOrder[] = res.data.map((o: DeliveryOrder) => ({
        ...o,
        created_at: new Date(o.created_at),
        updated_at: new Date(o.updated_at),
      }));
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, timeRange]);

  // --- KPIs ---
  const totalRevenue = orders.reduce((acc, order) => acc + order.total_price, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const uniqueCustomers = new Set(orders.map((o) => o.customer_id.id)).size;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // --- Driver stats ---
  const driverDeliveries: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.driver_id && o.status === "delivered") {
      const driverName = `${o.driver_id.user_id.firstname} ${o.driver_id.user_id.lastname}`;
      driverDeliveries[driverName] = (driverDeliveries[driverName] || 0) + 1;
    }
  });
  const bestDriver = Object.entries(driverDeliveries).sort((a, b) => b[1] - a[1])[0];

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekOrders = orders.filter(
    (o) => o.status === "delivered" && o.created_at >= weekStart
  );

  const driverDeliveriesThisWeek: Record<string, number> = {};
  weekOrders.forEach((o) => {
    if (o.driver_id) {
      const driverName = `${o.driver_id.user_id.firstname} ${o.driver_id.user_id.lastname}`;
      driverDeliveriesThisWeek[driverName] =
        (driverDeliveriesThisWeek[driverName] || 0) + 1;
    }
  });
  const bestDriverThisWeek = Object.entries(driverDeliveriesThisWeek).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // --- Revenue trend (by month) ---
  const revenueData: RevenueItem[] = Array.from({ length: 12 }, (_, i) => {
    const monthOrders = orders.filter((o) => o.created_at.getMonth() === i);
    return {
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      revenue: monthOrders.reduce((a, o) => a + o.total_price, 0),
      orders: monthOrders.length,
      customers: new Set(monthOrders.map((o) => o.customer_id.id)).size,
    };
  });

  // ✅ Strongly typed getMaxValue
  const getMaxValue = (data: RevenueItem[], key: keyof Omit<RevenueItem, "month">): number => {
    return Math.max(...data.map((item) => item[key] as number));
  };

  // --- Export CSV ---
  const handleExport = () => {
    if (!orders.length) return;

    const headers = ["Order Ref", "Customer", "Driver", "Total Price", "Status", "Created At"];
    const rows = orders.map((o) => [
      o.ref,
      `${o.customer_id.firstname} ${o.customer_id.lastname}`,
      o.driver_id
        ? `${o.driver_id.user_id.firstname} ${o.driver_id.user_id.lastname}`
        : "N/A",
      o.total_price,
      o.status,
      o.created_at.toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `dashboard_orders_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      {/* --- Header Controls --- */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "7d" | "30d" | "90d" | "1y")
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <select
            value={selectedMetric}
            onChange={(e) =>
              setSelectedMetric(e.target.value as "revenue" | "orders" | "customers")
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
            <option value="customers">Customers</option>
          </select>

          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* --- Content --- */}
      {loading ? (
        <Loading name="DATA" />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <KPI title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            <KPI title="Total Orders" value={totalOrders} />
            <KPI title="Delivered Orders" value={deliveredOrders} />
            <KPI title="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} />
            <KPI title="Active Customers" value={uniqueCustomers} />
            <KPI
              title="Best Driver (Month)"
              value={bestDriver ? `${bestDriver[0]} (${bestDriver[1]})` : "N/A"}
            />
            <KPI
              title="Best Driver (Week)"
              value={
                bestDriverThisWeek
                  ? `${bestDriverThisWeek[0]} (${bestDriverThisWeek[1]})`
                  : "N/A"
              }
            />
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="flex items-end space-x-2 h-64">
              {revenueData.map((data) => {
                const value = data[selectedMetric];
                const maxValue = getMaxValue(revenueData, selectedMetric);
                const height = maxValue ? (value / maxValue) * 200 : 0;

                return (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <div className="w-full flex items-end justify-center mb-2">
                      <div
                        className="bg-blue-500 rounded-t-lg w-full transition-all duration-500 hover:bg-blue-600 cursor-pointer"
                        style={{ height: `${height}px` }}
                        title={`${data.month}: ${
                          selectedMetric === "revenue" ? "$" : ""
                        }${value}`}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ✅ Reusable KPI component
const KPI: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);
