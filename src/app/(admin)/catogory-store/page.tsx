"use client";

import { useAuthStore } from "@/lib/store/auth";
import React, { useEffect, useState } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { Category } from "@/types/dashboard";
import AddCategoryForm from "@/components/Category/addCategory";
import UpdateCategoryForm from "@/components/Category/updateCategory";
import Loading from "@/components/reaction/Loading";
import DeletePopup from "@/components/reaction/DeletePopup";
import Pagination from "@/components/reaction/Pagination";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { token } = useAuthStore();
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectCategory,setSelectCategory]=useState("");

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
const handleUpdate=(id:string)=>{
  setSelectCategory(id);
  setOpenUpdate(true)
}
  const onDelete=(id:string)=>{
     setSelectCategory(id);
    setOpenDelete(true)
  }
  const handleDelete = async (id: string) => {
   

    try {
      const res = await fetch(`/api/admin/categorystore/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories(categories.filter((c) => c.id !== id));
      setOpenDelete(false)
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / entries);
  const displayed = filteredCategories.slice(
    (page - 1) * entries,
    page * entries
  );

  if (loading) {
    return (
     
      <Loading name={"Categories"}/>
    );
  }
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Categories Management
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-xl">Show</label>
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded-lg px-2 py-1 text-xl"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span className="text-xl">Entries</span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg px-8 py-2 text-xl focus:outline-none focus:ring focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => setOpenAdd(true)}
              className="px-6 py-2 ml-1 rounded-lg border hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              +
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-xl">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((categoryItem) => (
                <tr
                  key={categoryItem.id}
                  className="hover:bg-gray-50 transition-colors text-xl"
                >
                  <td className="p-3 border-b uppercase">{categoryItem.name}</td>

                  <td className="p-3 border-b text-center space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleUpdate(categoryItem.id)}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDelete(categoryItem.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    No Categories Exist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        
        <Pagination page={page} entries={entries} filtered={filteredCategories} setPage ={setPage} totalPages={totalPages}/>
      </div>

      {/* Add Category Modal */}
      {openAdd && <AddCategoryForm onClose={() => setOpenAdd(false)} token={token}  fetchCategory={fetchCategory}/>}
      {openUpdate && <UpdateCategoryForm onClose={() => setOpenUpdate(false)} token={token}  fetchCategory={fetchCategory} id={selectCategory} />}
      {openDelete && (
        <DeletePopup onConfirm={handleDelete} onCancel={() => setOpenDelete(false)} id={selectCategory}/>
      )}
    </div>
  );
}
