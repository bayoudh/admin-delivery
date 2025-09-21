"use client";

import { useAuthStore } from "@/lib/store/auth";
import React, { useEffect, useState } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { User } from "@/types/dashboard";


export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const { token } = useAuthStore();
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const fetchUsers = async () => {
    try {
      if (!token) throw new Error("No auth token found");

      const res = await fetch("/api/admin/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data: User[] = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstname} ${u.lastname} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / entries);
  const displayed = filteredUsers.slice((page - 1) * entries, page * entries);

  if (loading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-15 h-15 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 text-2xl  ">Loading users...</span>
        </div>
      </div>
    );
  }
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">
        User Management
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
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-8 py-2 text-xl focus:outline-none focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-xl">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors text-xl"
              >
                <td className="p-3 border-b">
                  {user.firstname} {user.lastname}
                </td>
                <td className="p-3 border-b">{user.email}</td>
                <td
                  className={`p-3 border-b capitalize ${
                    user.role === "customer"
                      ? "bg-green-100 text-green-800"
                      : user.role === "driver"
                      ? "bg-yellow-100 text-yellow-800"
                      : user.role === "restaurant"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </td>
                <td className="p-3 border-b text-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => alert(`Edit ${user.id}`)}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-500 text-sm"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-lg">
        <span>
          Showing {(page - 1) * entries + 1} to{" "}
          {Math.min(page * entries, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
        </span>
        <div className="flex space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded-lg border ${
              page === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg border ${
                page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded-lg border ${
              page === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
