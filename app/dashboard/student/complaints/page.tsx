"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function StudentComplaintsPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("faculty");
  const [complaints, setComplaints] = useState<any[]>([]);

  const fetchComplaints = async () => {
    const res = await fetch(`${API}/students/complaints`, {
      credentials: "include",
    });
    setComplaints(await res.json());
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const submit = async () => {
    await fetch(`${API}/students/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ category, subject, description }),
    });

    setSubject("");
    setDescription("");
    fetchComplaints();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Complaints</h1>

      <div className="bg-white p-4 rounded mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          <option value="faculty">Faculty</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="admin">Administration</option>
          <option value="other">Other</option>
        </select>

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Complaint
        </button>
      </div>

      <div className="bg-white rounded">
        {complaints.map((c) => (
          <div key={c._id} className="border-b p-3">
            <div className="font-medium">{c.subject}</div>
            <div className="text-sm text-gray-600">
              {c.category} • {c.status}
            </div>
            {c.remarks && (
              <div className="text-sm text-red-600">
                Remarks: {c.remarks}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
