"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  if (!me)
    return (
      <div className="p-6">
        <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
      </div>
    );

  return (
    <div className="space-y-10 p-4 sm:p-6">
      {/* Hero Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Welcome, {me.name}
          </h1>
          <p className="text-gray-600 mt-3 max-w-md">
            Manage student submissions, verify documents, and monitor your
            approval statistics all in one place.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/faculty.png"
            alt="Faculty dashboard illustration"
            width={600}
            height={400}
            className="w-full max-w-lg h-auto"
            priority
          />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Permissions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PermissionCard
            label="Certificates"
            enabled={me.permissions?.can_verify_certificates ?? false}
          />
          <PermissionCard
            label="Projects"
            enabled={me.permissions?.can_verify_projects ?? false}
          />
          <PermissionCard
            label="Internships"
            enabled={me.permissions?.can_verify_internships ?? false}
          />
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Verification Stats
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      className={`p-4 rounded-lg border transition ${
        enabled
          ? "border-green-300 bg-green-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            enabled ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
        <p className="font-medium text-gray-900 text-sm sm:text-base">
          {label}
        </p>
      </div>

      <p
        className={`text-xs sm:text-sm ${
          enabled ? "text-green-700" : "text-gray-600"
        }`}
      >
        {enabled
          ? "Can verify submissions"
          : "Cannot verify submissions"}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}