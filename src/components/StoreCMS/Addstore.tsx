"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Category } from "@/types/dashboard";

type AddRestaurantPageProps = {
  fetchRestaurants: () => void;
  setIsAddOpen: (open: boolean) => void;
  token: string | null;
};

export default function AddRestaurantPage({
  fetchRestaurants,
  setIsAddOpen,
  token,
}: AddRestaurantPageProps) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
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
  const [error, setError] = useState<string | null>(null); // backend error message

  // ✅ Fetch categories once
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (!token) throw new Error("No auth token found");

        const res = await fetch("/api/admin/categorystore", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };
    fetchCategory();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file" && e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files[0];
      setForm({
        ...form,
        [name]: file,
        photoPreview: file ? URL.createObjectURL(file) : null,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Handle form submit + show backend error message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // reset error before submitting

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (!value) return;
        if (typeof value === "string") formData.append(key, value);
        if (value instanceof File) formData.append(key, value);
      });

      const res = await fetch("/api/admin/restaurant?folder=menus", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        // Try to read JSON error message from backend
        const errData = await res.json().catch(() => ({}));
        const message = errData?.message || errData?.error || `Error ${res.status}`;
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Store added successfully!");
      fetchRestaurants();
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error adding Store:", error);
      setError("Failed to add Store. Please try again later.");
      toast.error("Failed to add Store.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Add New Store</h1>

      {/* ✅ Display red backend error message */}
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Firstname
            </label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lastname
            </label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* ✅ Select for category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type Store (Category)
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Zipcode
            </label>
            <input
              type="text"
              name="zipcode"
              value={form.zipcode}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Restaurant Photo
            </label>
            <input
              type="file"
              name="restaurant_photo"
              accept="image/*"
              onChange={handleChange}
              required
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 w-full py-4 rounded-lg font-medium transition-colors"
        >
          ADD
        </button>
      </form>
    </div>
  );
}
