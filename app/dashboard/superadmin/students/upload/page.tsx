"use client";

import { useState } from "react";
import Protected from "@/components/Protected";

export default function StudentUploadPage() {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a .xlsx file");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_URL}/students/upload`, {
        method: "POST",
        body: form,
        credentials: "include",   // 🔥 required for cookie auth
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      setMessage(
        `🎉 Success — ${data.created} created, ${data.updated} updated`
      );

    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Protected role="super_admin">

      <div className="min-h-screen p-10 bg-gray-100">

        <div className="max-w-2xl mx-auto bg-white shadow p-8 rounded-xl">

          <h2 className="text-2xl font-bold text-black mb-6">
            Upload Student Excel
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">

            <input
              type="file"
              accept=".xlsx"
              className="text-black border p-2"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

          </form>

          {message && (
            <p className="mt-4 text-black">{message}</p>
          )}

        </div>

      </div>

    </Protected>
  );
}
