import React, { useEffect, useState } from "react";
import { Category } from "@/types/dashboard"; // make sure this path is correct

interface UpdateCategoryFormProps {
  onClose: () => void;
  token: string | null;
  fetchCategory: () => void;
  id: string;
}

export default function UpdateCategoryForm({
  onClose,
  token,
  fetchCategory,
  id,
}: UpdateCategoryFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch current category data
  const getCategory = async () => {
    try {
      if (!token) throw new Error("No auth token found");

      const res = await fetch(`/api/admin/categorystore/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch category");

      const data: Category = await res.json();
      setName(data.name); // populate input with current name
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/categorystore/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.message || "Failed to update category");
        return;
      }

      // Success → refresh categories and close modal
      fetchCategory();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-3 p-6 border rounded-lg bg-white shadow-lg w-80"
      >
        <label className="font-semibold text-gray-700 text-lg">
          Update Category Store
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg border bg-yellow-600 hover:bg-yellow-700 text-white0 focus:ring-2 focus:ring-yellow-500"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
