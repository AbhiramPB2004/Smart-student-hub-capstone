"use client";

import { useEffect, useState } from "react";

type SuperAdmin = {
  _id: string;
  name: string;
  email: string;
  is_active: boolean;
  verification?: {
    status?: string;
  };
  university?: {
    name?: string;
  };
};

export default function SuperAdminsList() {
  const [admins, setAdmins] = useState<SuperAdmin[]>([]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (name) params.append("name", name);
    if (email) params.append("email", email);
    if (university) params.append("university", university);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/platform/super-admins?${params.toString()}`,
      { credentials: "include" }
    );

    const data = await res.json();
    setAdmins(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, [status]);

  const toggleStatus = async (id: string, active: boolean) => {
    if (!confirm(`Are you sure you want to ${active ? "enable" : "disable"} this account?`))
      return;

    setActionLoading(id);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/platform/super-admins/${id}/status?is_active=${active}`,
      { method: "PATCH", credentials: "include" }
    );
    await fetchAdmins();
    setActionLoading(null);
  };

  const deleteAdmin = async (id: string) => {
    if (!confirm("This will permanently disable this super admin. Continue?"))
      return;

    setActionLoading(id);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/platform/super-admins/${id}`,
      { method: "DELETE", credentials: "include" }
    );
    setAdmins(prev => prev.filter(a => a._id !== id));
    setActionLoading(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold  mb-4">
        University Admins (Super Admins)
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input
          placeholder="Search name"
          className="border px-3 py-2 rounded "
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Search email"
          className="border px-3 py-2 rounded "
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Search university"
          className="border px-3 py-2 rounded"
          onChange={e => setUniversity(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <button
        onClick={fetchAdmins}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>

      {loading ? (
        <p className="text-black">Loading…</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Email</th>
                <th>University</th>
                <th>Status</th>
                <th>Active</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a._id} className="border-t">
                  <td className="p-3 text-black">{a.name}</td>
                  <td className="text-black">{a.email}</td>
                  <td className="text-black">{a.university?.name || "-"}</td>
                  <td className="capitalize text-black">
                    {a.verification?.status || "-"}
                  </td>
                  <td className="text-black">
                    {a.is_active ? "Enabled" : "Disabled"}
                  </td>
                  <td className="p-3 flex justify-end gap-2">
                    <button
                      onClick={() => toggleStatus(a._id, !a.is_active)}
                      disabled={actionLoading === a._id}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        a.is_active ? "bg-orange-600" : "bg-green-600"
                      }`}
                    >
                      {a.is_active ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => deleteAdmin(a._id)}
                      disabled={actionLoading === a._id}
                      className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {admins.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-black">
                    No super admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
