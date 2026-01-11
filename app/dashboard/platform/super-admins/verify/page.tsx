"use client";

import { useEffect, useState } from "react";

type SuperAdminRequest = {
  _id: string;
  name: string;
  email: string;

  university_name: string;
  university_type: string;
  aishe_code: string;
  ugc_or_aicte_id: string;
  official_email_domain: string;
  state: string;
  district: string;

  website?: string;
  contact_phone?: string;
  established_year?: number;
};

export default function VerifyUniversities() {
  const [requests, setRequests] = useState<SuperAdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/platform/super-admins/requests`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch verification requests");
        }

        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const approve = async (id: string) => {
    if (!confirm("Approve this university and send activation email?")) return;

    setActionLoading(id);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/platform/super-admins/requests/${id}/approve`,
        { method: "POST", credentials: "include" }
      );

      setRequests(prev => prev.filter(r => r._id !== id));
    } catch {
      alert("Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id: string) => {
    if (!confirm("Reject this request?")) return;

    setActionLoading(id);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/platform/super-admins/requests/${id}/reject`,
        { method: "POST", credentials: "include" }
      );

      setRequests(prev => prev.filter(r => r._id !== id));
    } catch {
      alert("Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <p className="p-6 text-black">Loading verification requests…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-black mb-6">
        Super Admin Verification Requests
      </h1>

      {requests.length === 0 && (
        <p className="text-black">No pending requests.</p>
      )}

      {requests.map(req => (
        <div
          key={req._id}
          className="bg-white p-6 mb-6 shadow rounded-xl border"
        >
          {/* Applicant Info */}
          <div className="mb-4">
            <p className="text-black font-semibold">{req.name}</p>
            <p className="text-black text-sm">{req.email}</p>
          </div>

          {/* University Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-black mb-5">
            <p><b>University:</b> {req.university_name}</p>
            <p><b>Type:</b> {req.university_type}</p>
            <p><b>AISHE Code:</b> {req.aishe_code}</p>
            <p><b>UGC / AICTE:</b> {req.ugc_or_aicte_id}</p>
            <p><b>Email Domain:</b> {req.official_email_domain}</p>
            <p><b>State:</b> {req.state}</p>
            <p><b>District:</b> {req.district}</p>
            {req.website && <p><b>Website:</b> {req.website}</p>}
            {req.contact_phone && <p><b>Phone:</b> {req.contact_phone}</p>}
            {req.established_year && (
              <p><b>Established:</b> {req.established_year}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => approve(req._id)}
              disabled={actionLoading === req._id}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Approve & Send Email
            </button>

            <button
              onClick={() => reject(req._id)}
              disabled={actionLoading === req._id}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
