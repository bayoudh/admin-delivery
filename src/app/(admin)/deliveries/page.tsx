
"use client"
import React, { useState } from "react";

export default function AddCategoryForm() {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    // For now just log the category name
    console.log("New Category:", name);

    // Reset input after submit
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
             flex flex-col space-y-3 p-6 border rounded-lg bg-white shadow-lg w-80"
    >
      
      <label className="font-semibold text-gray-700">Add Category Store</label>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-2">
        <button
        type="button"
        className="px-6 py-2 rounded-lg border bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      >
        cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2 rounded-lg border bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      >
        +
      </button>
      </div>
      
    </form>
  );
}
