"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Category } from "@/types/dashboard";

type UpdateRestaurantPageProps = {
  restaurantId: string;
  fetchRestaurants: () => void;
  setIsEditOpen: (open: boolean) => void;
  token: string | null;
};

export default function UpdateRestaurantPage({
  restaurantId,
  fetchRestaurants,
  setIsEditOpen,
  token,
}: UpdateRestaurantPageProps) {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    street: "",
    city: "",
    zipcode: "",
    restaurant_photo: null as File | null,
    photoPreview: null as string | null,
    category_id: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch categories and restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("No auth token found");

        // Fetch categories
        const catRes = await fetch("/api/admin/categorystore", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const catData: Category[] = await catRes.json();
        setCategories(catData);

        // Fetch restaurant data by ID
        const res = await fetch(`/api/admin/restaurant/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch restaurant data");

        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          email: data.email || "",
          phone: data.phone || "",
          name: data.name || "",
          street: data.street || "",
          city: data.city || "",
          zipcode: data.zipcode || "",
          category_id: data.category_id || "",
          photoPreview: data.restaurant_photo || null,
        }));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };
    fetchData();
  }, [restaurantId, token]);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (
      type === "file" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      const file = e.target.files[0];
      setForm({
        ...form,
        [name]: file,
        photoPreview: file ? URL.createObjectURL(file) : form.photoPreview,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Handle form submit (PATCH update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (
          value instanceof File ||
          (typeof value === "string" && value.trim() !== "")
        ) {
          formData.append(key, value);
        }
      });

      const res = await fetch(`/api/admin/restaurant/${restaurantId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message =
          errData?.message || errData?.error || `Error ${res.status}`;
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Store updated successfully!");
      fetchRestaurants();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating Store:", error);
      setError("Failed to update Store. Please try again later.");
      toast.error("Failed to update Store.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Update Store</h1>

      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-2 gap-3 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              Store Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              City
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              ZipCode
            </label>
            <input
              type="text"
              name="zipcode"
              value={form.zipcode}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* ✅ Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type Store (Category)
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Restaurant Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Restaurant Photo
            </label>
            <input
              type="file"
              name="restaurant_photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />

            {form.photoPreview && (
              <div className="mt-3">
                <Image
                  width={128}
                  height={128}
                  src={form.photoPreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 w-full py-4 rounded-lg font-medium transition-colors"
        >
          UPDATE
        </button>
      </form>
    </div>
  );
}
