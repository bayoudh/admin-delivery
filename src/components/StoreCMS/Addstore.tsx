"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

type AddRestaurantPageProps = {
  fetchRestaurants: () => void;
  setIsAddOpen: (open: boolean) => void;
};

export default function AddRestaurantPage({
  fetchRestaurants,
  setIsAddOpen,
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
    photo: null as File | null,
    photoPreview: null as string | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
     if (type === "file" && files) {
    const file = files[0];
    setForm({
      ...form,
      [name]: file,
      photoPreview: file ? URL.createObjectURL(file) : null,
    });
  } else {
    setForm({ ...form, [name]: value });
  }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
          Object.entries(form).forEach(([key, value]) => {
      if (!value) return; // skip null or empty

      // Handle string values
      if (typeof value === "string") {
        formData.append(key, value);
      }

      // Handle File (photo) values
      if (value instanceof File) {
        formData.append(key, value);
      }
    });

      const res = await fetch("/api/restaurants", {
        method: "POST",
        body: formData, // send file + text together
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      toast.success("Restaurant added successfully!");
      fetchRestaurants();
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error adding restaurant:", error);
      toast.error("Failed to add restaurant.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Add New Store</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Firstname Bigboss Restaurant
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
              Lastname Bigboss Restaurant
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
              Email Restaurant
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
              Phone Restaurant
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
              Nom Restaurant
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
              Photo
            </label>

              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg"
              />

              {form.photoPreview && (
                <div className="mt-3">
                  <Image
                    src={form.photoPreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border"
                  />
                </div>
              )}
           
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 w-full py-4 rounded-lg font-medium transition-colors"
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}
