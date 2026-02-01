"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface FacultyMe {
  name: string;
  permissions: {
    can_verify_certificates: boolean;
    can_verify_projects: boolean;
    can_verify_internships: boolean;
  };
  verification_stats: {
    verified_count: number;
    rejected_count: number;
  };
}

export default function FacultyDashboard() {
  const [me, setMe] = useState<FacultyMe | null>(null);

  useEffect(() => {
    fetch(`${API}/faculty/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMe);
  }, []);

  if (!me) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Welcome, {me.name}
      </h1>

      {/* Permissions */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <PermissionCard
          label="Certificates"
          enabled={me.permissions?.can_verify_certificates ?? false}
        />
        <PermissionCard
          label="Projects"
          enabled={me.permissions.can_verify_projects ?? false}
        />
        <PermissionCard
          label="Internships"
          enabled={me.permissions.can_verify_internships ?? false}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Approved"
          value={me.verification_stats.verified_count}
        />
        <StatCard
          label="Rejected"
          value={me.verification_stats.rejected_count}
        />
      </div>
    </div>
  );
}

function PermissionCard({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div
      className={`p-4 rounded border ${
        enabled
          ? "bg-green-50 border-green-400"
          : "bg-gray-50 border-gray-300"
      }`}
    >
      <p className="font-medium">{label}</p>
      <p className="text-sm mt-1">
        {enabled ? "Approval Enabled" : "No Access"}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
