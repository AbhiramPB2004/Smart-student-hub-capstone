"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function FacultyMarksUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadMarks = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    await fetch(`${API}/faculty/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    setLoading(false);
    setFile(null);

    alert("Marks uploaded");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Upload Student Marks
      </h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadMarks}
        disabled={loading}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
