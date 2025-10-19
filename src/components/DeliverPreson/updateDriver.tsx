"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UpdateDriverPageProps = {
  driverId: string;
  fetchDrivers: () => void;
  setIsEditOpen: (open: boolean) => void;
  token: string | null;
};

export default function UpdateDriverPage({
  driverId,
  fetchDrivers,
  setIsEditOpen,
  token,
}: UpdateDriverPageProps) {
  const [form, setForm] = useState({
    vehicle_type:"",
    plate_number:"",
    driver_photo: null as File | null,
    photoPreview: null as string | null,
    
  });

  
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch categories and restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("No auth token found");

        // Fetch restaurant data by ID
        const res = await fetch(`/api/admin/driver/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch restaurant data");

        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          vehicle_type: data.vehicle_type || "",
          plate_number: data.plate_number || "",
          photoPreview: data.driver_photo || null,
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
  }, [driverId, token]);

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

      const res = await fetch(`/api/admin/driver/${driverId}`, {
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

      toast.success("Driver updated successfully!");
      fetchDrivers();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating Driver:", error);
      setError("Failed to update Driver. Please try again later.");
      toast.error("Failed to update Driver.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Update Driver</h1>

      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-2 gap-3 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
             Vehicle Type
            </label>
            <input
              type="text"
              name="vehicle_type"
              value={form.vehicle_type}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              plate number
            </label>
            <input
              type="text"
              name="plate_number"
              value={form.plate_number}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>
          
        
          {/* ✅ Driver Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Driver Photo
            </label>
            <input
              type="file"
              name="driver_photo"
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
