"use client";

import { useAuthStore } from "@/lib/store/auth";
import React, { useEffect, useState,useCallback  } from "react";
import { Trash2, Edit3, Search, Filter } from "lucide-react";
import { User } from "@/types/dashboard";
import Loading from "@/components/reaction/Loading";
import Pagination from "@/components/reaction/Pagination";
import UpdateUserPage from "./UpdateUser";
import DeletePopup from "@/components/reaction/DeletePopup"; // ✅ make sure path matches

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const token = useAuthStore.getState().token;

  // ✅ For edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // ✅ For delete popup
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () =>  {
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
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((user) => user.id !== id));
      setOpenDelete(false);
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the user.");
    }
  };

  const handleEdit = (userId: string) => {
    setSelectedUser(userId);
    setIsEditOpen(true);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = `${u.firstname} ${u.lastname} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "all"
        ? true
        : u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / entries);
  const displayed = filteredUsers.slice((page - 1) * entries, page * entries);

  if (loading) return <Loading name={"users"} />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">
        User Management
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="restaurant">Restaurant</option>
              <option value="driver">Driver</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Show entries */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-lg">Show</label>
          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded-lg px-2 py-1 text-lg"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span className="text-lg">Entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-lg">
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
                className="hover:bg-gray-50 transition-colors text-lg"
              >
                <td className="p-3 border-b">
                  {user.firstname} {user.lastname}
                </td>
                <td className="p-3 border-b">{user.email}</td>
                <td
                  className={`p-3 border-b capitalize text-center ${
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
                    onClick={() => handleEdit(user.id)}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setSelectedDeleteId(user.id);
                      setOpenDelete(true);
                    }}
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
      <Pagination
        page={page}
        entries={entries}
        filtered={filteredUsers}
        setPage={setPage}
        totalPages={totalPages}
      />

      {/* Edit Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditOpen(false)}
            >
              ✕
            </button>
            <UpdateUserPage
              setIsEditOpen={setIsEditOpen}
              token={token}
              fetchUsers={fetchUsers}
              userId={selectedUser}
            />
          </div>
        </div>
      )}

      {/* ✅ Delete Popup */}
      {openDelete && selectedDeleteId && (
        <DeletePopup
          name={"user"}
          id={selectedDeleteId}
          onConfirm={handleDelete}
          onCancel={() => setOpenDelete(false)}
        />
      )}
    </div>
  );
}
