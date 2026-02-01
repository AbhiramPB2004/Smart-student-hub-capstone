"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Admin {
  _id: string;
  name: string;
  email: string;
  is_active: boolean;
  university_id: string;
  created_at: string;
}

export default function UniversityAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    university_id: "",
  });

  // 📥 Fetch admins
  const fetchAdmins = async () => {
    const res = await fetch(`${API}/superadmin/admins`, {
      credentials: "include",
    });
    const data = await res.json();
    setAdmins(data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ➕ Create Admin
  const createAdmin = async () => {
    if (!form.name || !form.email || !form.university_id) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    await fetch(`${API}/superadmin/admins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "", university_id: "" });
    setLoading(false);
    fetchAdmins();
  };

  // 🔁 Enable / Disable
  const toggleStatus = async (id: string, status: boolean) => {
    await fetch(
      `${API}/superadmin/admins/${id}/status?is_active=${status}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    fetchAdmins();
  };

  // 🔐 Reset Password
  const resetPassword = async (id: string) => {
    if (!confirm("Send password reset email to admin?")) return;

    await fetch(`${API}/superadmin/admins/${id}/reset-password`, {
      method: "POST",
      credentials: "include",
    });

    alert("Password reset email sent");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        University Admin Management
      </h1>

      {/* Create Admin */}
      <div className="bg-white p-4 rounded mb-6">
        <h2 className="font-medium mb-3">Create University Admin</h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="University ID"
            value={form.university_id}
            onChange={(e) =>
              setForm({ ...form, university_id: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={createAdmin}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>University ID</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="p-3">{a.name}</td>
                <td>{a.email}</td>
                <td>{a.university_id}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      a.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="text-center space-x-2">
                  <button
                    onClick={() => toggleStatus(a._id, !a.is_active)}
                    className="text-blue-600 underline"
                  >
                    {a.is_active ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => resetPassword(a._id)}
                    className="text-red-600 underline"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}

            {admins.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No university admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
