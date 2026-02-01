"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Certificate {
  _id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  remarks?: string;
}

interface Faculty {
  _id: string;
  name: string;
  email: string;
}

export default function StudentCertificatesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [certs, setCerts] = useState<Certificate[]>([]);

  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [facultySearch, setFacultySearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH DATA
     ========================= */

  const fetchCertificates = async () => {
    const res = await fetch(`${API}/students/certificates/list`, {
      credentials: "include",
    });
    const data = await res.json();
    setCerts(data);
  };

  const fetchFaculty = async () => {
    const res = await fetch(`${API}/faculty/list`, {
      credentials: "include",
    });
    const data = await res.json();
    setFaculty(data);
  };

  useEffect(() => {
    fetchCertificates();
    fetchFaculty();
  }, []);

  /* =========================
     FACULTY SEARCH + SELECT
     ========================= */

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.email.toLowerCase().includes(facultySearch.toLowerCase())
  );

  const toggleFaculty = (id: string) => {
    setSelectedFaculty((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  /* =========================
     UPLOAD CERTIFICATE
     ========================= */

  const uploadCertificate = async () => {
    if (!file || !title || selectedFaculty.length === 0) {
      alert("Please fill all fields and select at least one faculty");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    selectedFaculty.forEach((fid) =>
      formData.append("assigned_faculty_ids", fid)
    );

    setLoading(true);

    await fetch(`${API}/students/certificates/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    setLoading(false);
    setFile(null);
    setTitle("");
    setSelectedFaculty([]);
    setFacultySearch("");

    fetchCertificates();
  };

  /* =========================
     UI
     ========================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Certificates</h1>

      {/* ================= Upload Section ================= */}
      <div className="bg-white p-4 rounded mb-6 space-y-4">

        {/* Title */}
        <input
          type="text"
          placeholder="Certificate Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Faculty Search */}
        <div>
          <label className="block font-medium mb-1">
            Assign Faculty
          </label>

          <input
            type="text"
            placeholder="Search faculty by name or email"
            value={facultySearch}
            onChange={(e) => setFacultySearch(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <div className="border rounded max-h-48 overflow-y-auto p-2 space-y-2">
            {filteredFaculty.map((f) => (
              <label
                key={f._id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFaculty.includes(f._id)}
                  onChange={() => toggleFaculty(f._id)}
                />
                <span>
                  {f.name}{" "}
                  <span className="text-gray-500 text-xs">
                    ({f.email})
                  </span>
                </span>
              </label>
            ))}

            {filteredFaculty.length === 0 && (
              <p className="text-xs text-gray-500">
                No faculty found
              </p>
            )}
          </div>
        </div>

        {/* File */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={uploadCertificate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Certificate"}
        </button>
      </div>

      {/* ================= Certificate List ================= */}
      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.title}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      c.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : c.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td>{c.remarks || "-"}</td>
              </tr>
            ))}

            {certs.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  No certificates uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
