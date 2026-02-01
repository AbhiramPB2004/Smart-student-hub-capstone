"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface DocumentItem {
  id: string;
  type: "certificate" | "internship";
  title: string;
  role?: string;
  status: string;
  file_id: string;
  submitted_at: string;
}

export default function StudentDocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  const fetchDocs = async () => {
    const res = await fetch(
      `${API}/students/certificates/documents?doc_type=${type}&search=${search}`,
      { credentials: "include" }
    );
    setDocs(await res.json());
  };

  useEffect(() => {
    fetchDocs();
  }, [type]);

  const deleteDoc = async (doc: DocumentItem) => {
    if (!confirm("Delete this document permanently?")) return;

    await fetch(
      `${API}/students/documents/${doc.type}/${doc.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    fetchDocs();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Approved Documents
      </h1>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2"
        >
          <option value="all">All</option>
          <option value="certificate">Certificates</option>
          <option value="internship">Internships</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          className="border p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={fetchDocs}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th>Title</th>
              <th>Role</th>
              <th>Uploaded</th>
              <th>File</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3 capitalize">{d.type}</td>
                <td>{d.title}</td>
                <td>{d.role || "-"}</td>
                <td>
                  {new Date(d.submitted_at).toLocaleDateString()}
                </td>
                <td>
                  <a
                    href={`${API}/files/${d.file_id}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => deleteDoc(d)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {docs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  No approved documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
