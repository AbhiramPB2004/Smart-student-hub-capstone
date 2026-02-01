"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StudentGuard from "./StudentGuard";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch(`${API}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setProfileCompleted(data?.status?.profile_completed === true);
    };

    fetchMe();
  }, []);

  // Loading state
  if (profileCompleted === null) {
    return null;
  }

  const disabledClass = "pointer-events-none text-gray-400";
  const enabledClass = "hover:underline";

  return (
    <StudentGuard>
      <div className="flex min-h-screen bg-slate-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4">
          <h2 className="text-lg font-semibold mb-6">
            Student Panel
          </h2>

          {/* 🚨 PROFILE INCOMPLETE WARNING */}
          {!profileCompleted && (
            <div className="mb-4 rounded bg-red-100 text-red-700 p-3 text-xs">
              ⚠️ Your profile is incomplete.  
              Please complete it to unlock all features.
            </div>
          )}

          <nav className="flex flex-col gap-3 text-sm">
            {/* Dashboard */}
            <Link
              href="/dashboard/student"
              className={profileCompleted ? enabledClass : disabledClass}
            >
              Dashboard
            </Link>

            {/* Academic */}
            <div className="mt-4 text-xs font-semibold text-gray-500 uppercase">
              Academic
            </div>

            <Link
              href="/dashboard/student/marks"
              className={profileCompleted ? enabledClass : disabledClass}
            >
              Marks
            </Link>

            {/* Documents */}
            <div className="mt-4 text-xs font-semibold text-gray-500 uppercase">
              Documents
            </div>

            <Link
              href="/dashboard/student/certificates"
              className={profileCompleted ? enabledClass : disabledClass}
            >
              Upload Certificates
            </Link>

            <Link
              href="/dashboard/student/internships"
              className={profileCompleted ? enabledClass : disabledClass}
            >
              Upload Internships
            </Link>

            <Link
              href="/dashboard/student/projects"
              className={profileCompleted ? enabledClass : disabledClass}
            >
              Submit Projects
            </Link>

            <Link
              href="/dashboard/student/documents"
              className={profileCompleted ? enabledClass : disabledClass}
            >
              Approved Documents
            </Link>

            {/* Profile */}
            <div className="mt-4 text-xs font-semibold text-gray-500 uppercase">
              Profile
            </div>

            <Link
              href="/dashboard/student/profile"
              className="hover:underline font-medium text-blue-600"
            >
              Complete Profile
            </Link>

            {/* Support */}
            <div className="mt-4 text-xs font-semibold text-gray-500 uppercase">
              Support
            </div>

            <Link
              href="/dashboard/student/complaints"
              className="hover:underline"
            >
              Complaints
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </StudentGuard>
  );
}
