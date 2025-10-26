"use client";

import { useAuthStore } from "@/lib/store/auth";
import { driver, User } from "@/types/dashboard";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  restaurant_id: string;
}

interface Restaurant {
  id: string;
  name: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price?: number;
}

export default function CreateOrderDeliveryPage() {
  const [customerId, setCustomerId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [deliveryStreet, setDeliveryStreet] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryZipcode, setDeliveryZipcode] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { product_id: "", quantity: 1, price: 0 },
  ]);
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<driver[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);

  const token = useAuthStore.getState().token;

  // ✅ Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [restaurantRes, customerRes, driverRes] = await Promise.all([
          fetch("/api/admin/restaurant", { headers }),
          fetch("/api/admin/customer", { headers }),
          fetch("/api/admin/driver", { headers }),
        ]);

        if (!restaurantRes.ok || !customerRes.ok || !driverRes.ok) {
          throw new Error("Failed to fetch dropdown data");
        }

        const [restaurantsData, customersData, driversData] = await Promise.all(
          [restaurantRes.json(), customerRes.json(), driverRes.json()]
        );

        setRestaurants(restaurantsData);
        setCustomers(customersData);
        setDrivers(driversData);
      } catch (error) {
        toast.error("❌ Failed to load dropdown data");
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Fetch products when restaurant changes
  useEffect(() => {
    if (!restaurantId) return;
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/admin/products?restaurant_id=${restaurantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch {
        toast.error("❌ Failed to load restaurant products");
      }
    };
    fetchProducts();
  }, [restaurantId, token]);

  // ✅ Compute total price
  const totalPrice = items.reduce(
    (sum, i) => sum + (i.price || 0) * i.quantity,
    0
  );

  const handleAddItem = () => {
    setItems([...items, { product_id: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(
      updated.length ? updated : [{ product_id: "", quantity: 1, price: 0 }]
    );
  };

  const handleItemChange = (
    index: number,
    key: "product_id" | "quantity",
    value: string
  ) => {
    const newItems = [...items];
    if (key === "product_id") {
      newItems[index].product_id = value;
      const found = products.find((p) => p.id === value);
      newItems[index].price = found ? found.price : 0;
    } else if (key === "quantity") {
      newItems[index].quantity = Number(value);
    }
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          restaurant_id: restaurantId,
          driver_id: driverId || null,
          payment_method: paymentMethod,
          delivery_street: deliveryStreet,
          delivery_city: deliveryCity,
          delivery_zipcode: deliveryZipcode,
          items,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();
      toast.success(`✅ Order created! Total: $${data.total_price.toFixed(2)}`);

      // Reset form
      setCustomerId("");
      setRestaurantId("");
      setDriverId("");
      setDeliveryStreet("");
      setDeliveryCity("");
      setDeliveryZipcode("");
      setItems([{ product_id: "", quantity: 1, price: 0 }]);
      setProducts([]);
    } catch (error) {
      console.error("Error fetching order:", error);

      toast.error("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🛒 Create New Order Drivery
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer & Restaurant */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstname} {c.lastname}
              </option>
            ))}
          </select>

          <select
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Driver & Payment */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          >
            <option value="">Select Driver (optional)</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d?.user_id.firstname} {d?.user_id.lastname}
              </option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as "cash" | "card")
            }
            className="flex-1 border rounded-lg px-3 py-2"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Delivery */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Street"
            value={deliveryStreet}
            onChange={(e) => setDeliveryStreet(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Zipcode"
            value={deliveryZipcode}
            onChange={(e) => setDeliveryZipcode(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Items */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">🧾 List Product</h2>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <select
                value={item.product_id}
                onChange={(e) =>
                  handleItemChange(index, "product_id", e.target.value)
                }
                className="col-span-4 border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.price}TND)
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="col-span-2 border rounded-lg px-3 py-2 text-center"
                min={1}
                required
              />

              <div className="col-span-2 text-gray-700 text-center">
                {item.price?.toFixed(2) || "0.00"} TND
              </div>

              <div className="col-span-2 text-right font-semibold text-green-700">
                {(item.price! * item.quantity).toFixed(2)} TND
              </div>

              {/* ✅ Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="col-span-2 flex items-center justify-center text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ➕ Add Item
          </button>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold text-green-600">
            {totalPrice.toFixed(2)} TND
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium mt-4"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}
