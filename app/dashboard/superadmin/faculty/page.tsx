"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Faculty {
  _id: string;
  name: string;
  email: string;
  is_active: boolean;
  academic: {
    department: string;
    designation: string;
  };
  permissions: {
    can_verify_certificates: boolean;
    can_verify_projects: boolean;
    can_verify_internships: boolean;
  };
}

export default function FacultyManagementPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchFaculty = async () => {
    const res = await fetch(`${API}/superadmin/faculty`, {
      credentials: "include",
    });
    const data = await res.json();
    setFaculty(data);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // 📤 Upload Excel
  const uploadExcel = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    await fetch(`${API}/superadmin/faculty/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    setLoading(false);
    setFile(null);
    fetchFaculty();
  };

  // 🔁 Activate / Deactivate
  const toggleStatus = async (id: string, status: boolean) => {
    await fetch(`${API}/superadmin/faculty/${id}/status?is_active=${status}`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchFaculty();
  };

  // 🔐 Reset Password
  const resetPassword = async (id: string) => {
    if (!confirm("Send password reset email to faculty?")) return;

    await fetch(`${API}/superadmin/faculty/${id}/reset-password`, {
      method: "POST",
      credentials: "include",
    });

    alert("Password reset email sent");
  };

  // 🛂 Update Permissions
  const updatePermissions = async (
    id: string,
    permissions: Faculty["permissions"]
  ) => {
    setSavingId(id);

    await fetch(`${API}/superadmin/faculty/${id}/permissions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(permissions),
    });

    setSavingId(null);
    fetchFaculty();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Faculty Management</h1>

      {/* Upload Section */}
      <div className="bg-white p-4 rounded mb-6">
        <h2 className="font-medium mb-2">Upload Faculty (Excel)</h2>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={uploadExcel}
          disabled={loading}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Approval Permissions</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {faculty.map((f) => (
              <tr key={f._id} className="border-t align-top">
                <td className="p-3">{f.name}</td>
                <td>{f.email}</td>
                <td>{f.academic.department}</td>

                {/* Permissions */}
                <td>
                  <div className="flex flex-col gap-1 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={f.permissions.can_verify_certificates}
                        onChange={(e) =>
                          updatePermissions(f._id, {
                            ...f.permissions,
                            can_verify_certificates: e.target.checked,
                          })
                        }
                      />
                      Certificates
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={f.permissions.can_verify_projects}
                        onChange={(e) =>
                          updatePermissions(f._id, {
                            ...f.permissions,
                            can_verify_projects: e.target.checked,
                          })
                        }
                      />
                      Projects
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={f.permissions.can_verify_internships}
                        onChange={(e) =>
                          updatePermissions(f._id, {
                            ...f.permissions,
                            can_verify_internships: e.target.checked,
                          })
                        }
                      />
                      Internships
                    </label>

                    {savingId === f._id && (
                      <span className="text-blue-600 text-xs">
                        Saving...
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      f.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {f.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="text-center space-x-2">
                  <button
                    onClick={() => toggleStatus(f._id, !f.is_active)}
                    className="text-blue-600 underline"
                  >
                    {f.is_active ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => resetPassword(f._id)}
                    className="text-red-600 underline"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}

            {faculty.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No faculty found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
