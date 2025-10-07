"use client";

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
    nom: "", // maps to "name"
    adresse: "", // maps to "cuisine" or address
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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
      <h1 className="text-2xl font-bold mb-4">Add New Restaurant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom Restaurant
          </label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            name="adresse"
            value={form.adresse}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
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
