"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UpdateCustomerPageProps = {
  fetchUsers: () => void;
  setIsEditOpen: (open: boolean) => void;
  token: string | null;
  userId: string;
};

export default function UpdateCustomerPage({
  fetchUsers,
  setIsEditOpen,
  token,
  userId,
}: UpdateCustomerPageProps) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    city: "",
    street: "",
    zipcode: "",
    password: "", // ✅ Password field
  });

  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch existing user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) throw new Error("Unauthorized");

        const res = await fetch(`/api/admin/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch Customer details");

        const data = await res.json();
        setForm({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          street: data.street || "",
          zipcode: data.zipcode || "",
          password: "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    };

    fetchUser();
  }, [userId, token]);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ Submit updated data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const body = JSON.stringify(form);

      const res = await fetch(`/api/admin/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.message || data?.error || "Update failed";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Customer updated successfully!");
      fetchUsers();
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update Customer. Please try again later.");
      toast.error("Failed to update Customer.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Update Customer</h1>

      {/* ✅ Error message */}
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
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
              Zipcode
            </label>
            <input
              type="text"
              name="zipcode"
              value={form.zipcode}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* ✅ Password field (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password (optional)
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
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
