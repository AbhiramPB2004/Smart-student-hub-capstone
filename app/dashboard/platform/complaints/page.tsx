"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  student: {
    name: string;
    email: string;
    register_no: string;
  };
}

export default function PlatformAdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const fetchComplaints = async () => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (category) params.append("category", category);
    if (search) params.append("search", search);

    const res = await fetch(
      `${API}/platformadmin/complaints?${params.toString()}`,
      { credentials: "include" }
    );

    const data = await res.json();
    setComplaints(data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        Complaints Overview
      </h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        >
          <option value="">All Categories</option>
          <option value="faculty">Faculty</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="exam">Exam</option>
          <option value="other">Other</option>
        </select>

        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={fetchComplaints}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-white text-sm rounded">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th>Category</th>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-3">
                <div className="font-medium">{c.student?.name}</div>
                <div className="text-xs text-gray-500">
                  {c.student?.email}
                </div>
              </td>
              <td>{c.category}</td>
              <td>{c.title}</td>
              <td>{c.status}</td>
              <td>
                {new Date(c.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}

          {complaints.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No complaints found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
