"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Certificate {
  status: "pending" | "approved" | "rejected";
}

interface StudentMe {
  name: string;
  email: string;
  register_no?: string;
  academic?: {
    department?: string;
    batch_year?: number;
    program?: string;
  };
  certificates?: Certificate[];
}

export default function StudentDashboard() {
  const [me, setMe] = useState<StudentMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/students/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMe(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-600">Unable to load student data</p>
      </div>
    );
  }

  const pending =
    me.certificates?.filter((c) => c.status === "pending").length || 0;
  const approved =
    me.certificates?.filter((c) => c.status === "approved").length || 0;
  const rejected =
    me.certificates?.filter((c) => c.status === "rejected").length || 0;
  const total = me.certificates?.length || 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Welcome back, {me.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Track your academic progress and manage your certificates easily.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <Image
            src="/hello.png"
            alt="Student dashboard illustration"
            width={500}
            height={300}
            className="w-full max-w-md h-auto"
            priority
          />
        </div>
      </div>

      {/* Student Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
        <h2 className="font-medium text-gray-900 mb-4 text-lg">
          Student Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">EMAIL</p>
              <p className="text-gray-900">{me.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                REGISTER NO
              </p>
              <p className="text-gray-900">
                {me.register_no || "Not set"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">
                DEPARTMENT
              </p>
              <p className="text-gray-900">
                {me.academic?.department || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                BATCH YEAR
              </p>
              <p className="text-gray-900">
                {me.academic?.batch_year || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Documents"
          value={total}
          color="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatCard
          label="Pending Approval"
          value={pending}
          color="bg-yellow-50 text-yellow-700 border-yellow-200"
        />
        <StatCard
          label="Approved"
          value={approved}
          color="bg-green-50 text-green-700 border-green-200"
        />
        <StatCard
          label="Rejected"
          value={rejected}
          color="bg-red-50 text-red-700 border-red-200"
        />
      </div>

      {/* Approval Progress */}
      {total > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
          <h2 className="font-medium text-gray-900 mb-4 text-lg">
            Document Status
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Approval Rate
              </span>
              <span className="font-medium text-gray-900">
                {((approved / total) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(approved / total) * 100}%`,
                }}
              />
            </div>

            <div className="text-xs text-gray-500">
              {approved} of {total} documents approved
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
        <h2 className="font-medium text-gray-900 mb-4 text-lg">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionCard
            title="Upload Certificate"
            description="Submit new certificates for verification"
          />
          <ActionCard
            title="View Marks"
            description="Check your academic performance"
          />
          <ActionCard
            title="Submit Project"
            description="Upload project details for review"
          />
          <ActionCard
            title="File Complaint"
            description="Report issues anonymously"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "bg-gray-50 text-gray-700 border-gray-200",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${color}`}>
      <p className="text-xs font-medium mb-1">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
      <p className="font-medium text-gray-900 text-sm">
        {title}
      </p>
      <p className="text-gray-500 text-xs mt-1">
        {description}
      </p>
    </div>
  );
}