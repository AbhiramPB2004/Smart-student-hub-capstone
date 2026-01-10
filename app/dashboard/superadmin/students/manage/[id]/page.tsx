"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StudentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // 🔒 prevent invalid fetch

    const loadStudent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/students/${id}`,
          { credentials: "include" }
        );

        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Failed to load student", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (!id) {
    return <p className="p-6 text-red-600">Invalid student ID</p>;
  }

  if (loading) {
    return <p className="p-6">Loading student...</p>;
  }

  if (!student) {
    return <p className="p-6 text-red-600">Student not found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {student.name}
      </h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <p><b>Email:</b> {student.email}</p>
        <p><b>Register No:</b> {student.register_no}</p>
        <p><b>University:</b> {student.academic?.university}</p>
        <p><b>Department:</b> {student.academic?.department}</p>
        <p><b>Program:</b> {student.academic?.program}</p>
        <p><b>Batch Year:</b> {student.academic?.batch_year}</p>
        <p><b>Semester:</b> {student.academic?.semester ?? "Not set"}</p>
        <p>
          <b>Status:</b>{" "}
          {student.is_active ? "Active" : "Inactive"}
        </p>
      </div>
    </div>
  );
}
