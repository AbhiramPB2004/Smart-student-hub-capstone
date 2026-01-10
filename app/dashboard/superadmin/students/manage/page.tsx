"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/students?${query}`,
      { credentials: "include" }
    );

    const data = await res.json();
    setStudents(data.students || []);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, [filters]);

  const resetPassword = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/students/${id}/reset-password`,
      { method: "POST", credentials: "include" }
    );
    alert("Password reset email sent");
  };

  const toggleStatus = async (id: string, is_active: boolean) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/students/${id}/status?is_active=${!is_active}`,
      { method: "PATCH", credentials: "include" }
    );
    loadStudents();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Students</h1>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow mb-6">
        <input
          placeholder="Search name / email"
          className="border px-3 py-2 rounded w-56"
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
        >
          <option value="">Department</option>
          <option>Electronics</option>
          <option>Computer Science</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, batch_year: e.target.value })
          }
        >
          <option value="">Batch</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, is_active: e.target.value })
          }
        >
          <option value="">Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* 📋 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Email</th>
                <th>Register</th>
                <th>Department</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.register_no}</td>
                  <td>{s.academic?.department}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        s.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="flex gap-3 justify-end pr-4">
                    <Link
                      href={`/dashboard/superadmin/students/manage/${s._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => resetPassword(s._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Reset
                    </button>

                    <button
                      onClick={() => toggleStatus(s._id, s.is_active)}
                      className="text-red-600 hover:underline"
                    >
                      {s.is_active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
