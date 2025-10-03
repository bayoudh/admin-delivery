"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Restaurant = {
  id: string;
  nom: string;
  adresse: string;
};

type UpdateRestaurantPageProps = {
  fetchRestaurants: () => void;
  setIsAddOpen: (open: boolean) => void;
  restaurantToEdit?: Restaurant; // optional for update
};

export default function UpdateRestaurantPage({
  fetchRestaurants,
  setIsAddOpen,
  restaurantToEdit,
}: UpdateRestaurantPageProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    adresse: "",
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (restaurantToEdit) {
      setForm({
        nom: restaurantToEdit.nom,
        adresse: restaurantToEdit.adresse,
      });
    }
  }, [restaurantToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        restaurantToEdit ? `/api/restaurants/${restaurantToEdit.id}` : "/api/restaurants",
        {
          method: restaurantToEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      toast.success(
        restaurantToEdit ? "Restaurant updated successfully!" : "Restaurant added successfully!"
      );
      fetchRestaurants();
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error(restaurantToEdit ? "Failed to update restaurant." : "Failed to add restaurant.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">
        {restaurantToEdit ? "Update Restaurant" : "Add New Restaurant"}
      </h1>
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
            {restaurantToEdit ? "UPDATE" : "ADD"}
          </button>
        </div>
      </form>
    </div>
  );
}
