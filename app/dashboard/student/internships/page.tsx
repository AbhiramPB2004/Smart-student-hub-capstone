"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Internship {
  _id: string;
  company: string;
  role: string;
  duration: string;
  status: "pending" | "approved" | "rejected";
  remarks?: string;
  file_id: string;
}

interface Faculty {
  _id: string;
  name: string;
  email: string;
}

export default function StudentInternshipsPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [facultySearch, setFacultySearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH DATA
     ========================= */

  const fetchFaculty = async () => {
    const res = await fetch(`${API}/faculty/list`, {
      credentials: "include",
    });
    setFaculty(await res.json());
  };

  const fetchInternships = async () => {
    const res = await fetch(`${API}/students/certificates/internships`, {
      credentials: "include",
    });
    setInternships(await res.json());
  };

  useEffect(() => {
    fetchFaculty();
    fetchInternships();
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
     UPLOAD INTERNSHIP
     ========================= */

  const uploadInternship = async () => {
    if (
      !company ||
      !role ||
      !duration ||
      !file ||
      selectedFaculty.length === 0
    ) {
      alert("Please fill all fields and select at least one faculty");
      return;
    }

    const formData = new FormData();
    formData.append("company", company);
    formData.append("role", role);
    formData.append("duration", duration);
    formData.append("file", file);

    selectedFaculty.forEach((fid) =>
      formData.append("assigned_faculty_ids", fid)
    );

    setLoading(true);

    await fetch(`${API}/students/certificates/internships/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    setLoading(false);
    setCompany("");
    setRole("");
    setDuration("");
    setFile(null);
    setSelectedFaculty([]);
    setFacultySearch("");

    fetchInternships();
  };

  /* =========================
     UI
     ========================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Internship Offer Letters
      </h1>

      {/* ================= Upload Section ================= */}
      <div className="bg-white p-4 rounded mb-6 space-y-4">

        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          placeholder="Role / Position"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          placeholder="Duration (e.g. 3 months)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
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

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={uploadInternship}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Internship"}
        </button>
      </div>

      {/* ================= Internship List ================= */}
      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th>Role</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Document</th>
            </tr>
          </thead>

          <tbody>
            {internships.map((i) => (
              <tr key={i._id} className="border-t">
                <td className="p-3">{i.company}</td>
                <td>{i.role}</td>
                <td>{i.duration}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      i.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : i.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {i.status}
                  </span>
                </td>
                <td>{i.remarks || "-"}</td>
                <td>
                  <a
                    href={`${API}/files/${i.file_id}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                </td>
              </tr>
            ))}

            {internships.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No internships uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
