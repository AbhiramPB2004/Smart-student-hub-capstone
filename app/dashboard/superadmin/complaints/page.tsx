"use client";

import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import DashboardShell from "@/components/DashboardShell";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "in_review" | "resolved" | "closed";
  remarks?: string | null;
  created_at: string;
}

export default function SuperAdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (category) params.append("category", category);
    if (search) params.append("search", search);

    const res = await fetch(
      `${API}/superadmin/complaints?${params.toString()}`,
      { credentials: "include" }
    );

    const data = await res.json();
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, [status, category]);

  const updateStatus = async (
    id: string,
    newStatus: Complaint["status"]
  ) => {
    const remarks =
      newStatus !== "open"
        ? prompt("Remarks (optional, visible to student):")
        : null;

    await fetch(`${API}/superadmin/complaints/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
        remarks,
      }),
    });

    fetchComplaints();
  };

  return (
    <Protected role="super_admin">
      <DashboardShell title="Student Complaints">

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            placeholder="Search title or description…"
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchComplaints()}
          />

          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="faculty">Faculty</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="administration">Administration</option>
            <option value="other">Other</option>
          </select>

          <button
            onClick={fetchComplaints}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left w-1/3">Complaint</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Loading complaints…
                  </td>
                </tr>
              )}

              {!loading &&
                complaints.map((c) => (
                  <tr key={c._id} className="border-t align-top">
                    {/* Complaint */}
                    <td className="p-3">
                      <p className="font-medium text-black">
                        {c.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                        {c.description}
                      </p>

                      {c.remarks && (
                        <p className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded">
                          <strong>Remarks:</strong> {c.remarks}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="capitalize">{c.category}</td>

                    {/* Status */}
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          c.status === "open"
                            ? "bg-red-100 text-red-700"
                            : c.status === "in_review"
                            ? "bg-yellow-100 text-yellow-700"
                            : c.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {c.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="text-center space-x-2 whitespace-nowrap">
                      {c.status !== "in_review" && (
                        <button
                          onClick={() =>
                            updateStatus(c._id, "in_review")
                          }
                          className="text-blue-600 underline"
                        >
                          Review
                        </button>
                      )}

                      {c.status !== "resolved" && (
                        <button
                          onClick={() =>
                            updateStatus(c._id, "resolved")
                          }
                          className="text-green-600 underline"
                        >
                          Resolve
                        </button>
                      )}

                      {c.status !== "closed" && (
                        <button
                          onClick={() =>
                            updateStatus(c._id, "closed")
                          }
                          className="text-gray-600 underline"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

              {!loading && complaints.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-gray-500"
                  >
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardShell>
    </Protected>
  );
}
