"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface ApprovalItem {
  certificate_id: string;
  student_id: string;
  student_name: string;
  register_no: string;
  title: string;
  file_id: string;
  submitted_at: string;
}

export default function FacultyApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH PENDING CERTIFICATES
     ========================= */

  const fetchApprovals = async () => {
    const res = await fetch(`${API}/faculty/certificates/pending`, {
      credentials: "include",
    });
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  /* =========================
     ACTIONS
     ========================= */

  const approve = async (certificateId: string) => {
    setLoading(true);
    await fetch(
      `${API}/faculty/certificates/${certificateId}/approve`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    setLoading(false);
    fetchApprovals();
  };

  const reject = async (certificateId: string) => {
    const remarks = prompt("Reason for rejection?");
    if (!remarks) return;

    setLoading(true);
    await fetch(
      `${API}/faculty/certificates/${certificateId}/reject`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks }),
      }
    );
    setLoading(false);
    fetchApprovals();
  };

  /* =========================
     UI
     ========================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Pending Certificate Approvals
      </h1>

      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th>Register No</th>
              <th>Certificate</th>
              <th>Submitted</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((i) => (
              <tr key={i.certificate_id} className="border-t">
                <td className="p-3">{i.student_name}</td>
                <td>{i.register_no}</td>
                <td>
                  <a
                    href={`${API}/files/${i.file_id}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {i.title}
                  </a>
                </td>
                <td>
                  {new Date(i.submitted_at).toLocaleDateString()}
                </td>
                <td className="text-center space-x-2">
                  <button
                    disabled={loading}
                    onClick={() => approve(i.certificate_id)}
                    className="text-green-600 underline"
                  >
                    Approve
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => reject(i.certificate_id)}
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
                  colSpan={5}
                  className="p-6 text-center text-gray-500"
                >
                  No pending approvals
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
