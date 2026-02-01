"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface InternshipApproval {
  internship_id: string;
  student_id: string;
  student_name: string;
  register_no: string;
  company: string;
  role: string;
  duration: string;
  file_id: string;
  submitted_at: string;
}

export default function FacultyInternshipApprovalsPage() {
  const [items, setItems] = useState<InternshipApproval[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApprovals = async () => {
    const res = await fetch(`${API}/faculty/internships/pending`, {
      credentials: "include",
    });

    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const approve = async (id: string) => {
    if (!confirm("Approve this internship?")) return;

    setLoading(true);
    await fetch(`${API}/faculty/internships/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });
    setLoading(false);

    fetchApprovals();
  };

  const reject = async (id: string) => {
    const remarks = prompt("Reason for rejection?");
    if (!remarks) return;

    setLoading(true);
    await fetch(`${API}/faculty/internships/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ remarks }),
    });
    setLoading(false);

    fetchApprovals();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Internship Approvals
      </h1>

      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th>Register No</th>
              <th>Company</th>
              <th>Role</th>
              <th>Duration</th>
              <th>Submitted</th>
              <th>Document</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((i) => (
              <tr key={i.internship_id} className="border-t">
                <td className="p-3">{i.student_name}</td>
                <td>{i.register_no}</td>
                <td>{i.company}</td>
                <td>{i.role}</td>
                <td>{i.duration}</td>
                <td>
                  {new Date(i.submitted_at).toLocaleDateString()}
                </td>
                <td>
                  <a
                    href={`${API}/files/${i.file_id}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                </td>
                <td className="text-center space-x-2">
                  <button
                    onClick={() => approve(i.internship_id)}
                    disabled={loading}
                    className="text-green-600 underline"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(i.internship_id)}
                    disabled={loading}
                    className="text-red-600 underline"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-gray-500"
                >
                  No pending internship approvals
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
