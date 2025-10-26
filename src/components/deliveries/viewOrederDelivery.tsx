"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/lib/store/auth"; // adjust this path if needed
import { DeliveryOrder, OrderItem } from "@/types/dashboard";



interface Props {
  open: boolean;
  onClose: () => void;
  orderid: string | null;
}

export default function ViewOrderPopup({ open, onClose, orderid }: Props) {
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore(); // get token from Zustand auth store
useEffect(() => {
  const fetchOrderDetails = async (id: string) => {
    if (!token) {
      console.warn("No auth token found!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/orders/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      setOrder(data.order);
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (open && orderid) {
    document.body.style.overflow = "hidden";
    fetchOrderDetails(orderid);
  } else {
    document.body.style.overflow = "auto";
  }
}, [open, orderid, token]);


  if (!open || !orderid) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : order ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p><strong>Order ID:</strong> {order.ref}</p>
              <p><strong>Status:</strong> <span className="text-blue-600">{order.status}</span></p>
              <p><strong>Payment:</strong> {order.payment_method}</p>
              <p><strong>Total:</strong> {order.total_price.toFixed(2)} TND</p>
              <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>

            {/* Address */}
            {order && (
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <h3 className="text-lg font-semibold mb-1">Shipping Address</h3>
                <p>{order.delivery_street}</p>
                <p>{order.delivery_city}, {order.delivery_zipcode}</p>
                
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center gap-3">
                      
                      <div>
                        <p className="font-medium">{item.product_id.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.product_id.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No order found.</p>
        )}
      </div>
    </div>
  );
}
