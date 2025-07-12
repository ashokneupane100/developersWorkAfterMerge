"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Mail,
  Phone,
  MoreVertical,
  User,
  UserCheck,
  UserX,
  Search,
  Trash2,
  AlertCircle,
  RefreshCw,
  Pencil
} from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  email_verified: boolean;
  password_updated_at: string | null;
  latitude: number | null;
  longitude: number | null;
  location_updated_at: string | null;
  location_permission: boolean;
  full_address: string | null;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_role: "Admin" | "Agent" | "Buyer";
  auth_provider: string;
  phone?: string | null;
}

const UsersPage: React.FC = () => {
  const supabase = createClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", userId);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editingUser.full_name,
          email: editingUser.email,
          avatar_url: editingUser.avatar_url,
          email_verified: editingUser.email_verified,
          latitude: editingUser.latitude,
          longitude: editingUser.longitude,
          location_permission: editingUser.location_permission,
          full_address: editingUser.full_address,
          address: editingUser.address,
          user_role: editingUser.user_role,
          auth_provider: editingUser.auth_provider,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingUser.id);
      if (error) throw error;
      closeEditModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboard>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Users</h2>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <button
              onClick={fetchUsers}
              className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              title="Refresh Users"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name || "User avatar"}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-indigo-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.full_name || "Unnamed User"}</div>
                          <div className="text-sm text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {user.user_role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.email_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.email_verified ? (
                          <span className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <UserX className="h-4 w-4 mr-1" /> Unverified
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-3">
                      <button onClick={() => openEditModal(user)} title="Edit">
                        <Pencil className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} title="Delete">
                        <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-6xl">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                {[
                  { key: "full_name", label: "Full Name" },
                  { key: "email", label: "Email" },
                  { key: "avatar_url", label: "Avatar URL" },
                  { key: "latitude", label: "Latitude" },
                  { key: "longitude", label: "Longitude" },
                  { key: "full_address", label: "Full Address" },
                  { key: "address", label: "Address" },
                  { key: "auth_provider", label: "Auth Provider" }
                ].map(({ key, label }) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={label}
                    value={(editingUser as any)[key] || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, [key]: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                ))}

                <div className="flex items-center space-x-2">
                  <label>Email Verified</label>
                  <input
                    type="checkbox"
                    checked={editingUser.email_verified}
                    onChange={(e) => setEditingUser({ ...editingUser, email_verified: e.target.checked })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label>Location Permission</label>
                  <input
                    type="checkbox"
                    checked={editingUser.location_permission}
                    onChange={(e) => setEditingUser({ ...editingUser, location_permission: e.target.checked })}
                  />
                </div>
                <div>
                  <label>User Role</label>
                  <select
                    value={editingUser.user_role}
                    onChange={(e) => setEditingUser({ ...editingUser, user_role: e.target.value as any })}
                    className="w-full border p-2 rounded"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Agent">Agent</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={closeEditModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleUpdateUser} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default UsersPage;
