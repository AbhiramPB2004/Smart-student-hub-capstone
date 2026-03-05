"use client";

import Protected from "@/components/Protected";
import DashboardShell from "@/components/DashboardShell";
import Link from "next/link";
import Image from "next/image";

export default function SuperAdminDashboard() {
  return (
    <Protected role="super_admin">
      <DashboardShell title="Super Admin Dashboard">
        <div className="space-y-8">
          {/* Hero Image at the top */}
          <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black/20" />
            <Image
              src="/College.png"
              alt="University campus illustration"
              fill
              className="object-cover mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Shape the Future of Education
                </h3>
                <p className="text-white/90 max-w-2xl">
                  Your centralized dashboard for managing academic excellence
                </p>
              </div>
            </div>
          </div>

          {/* Intro */}
          <div>
            <p className="text-gray-600 text-lg max-w-2xl">
              Manage university users, academic operations, and student grievances
              from one centralized system.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card
              title="University Admins"
              description="Create & manage institution owners"
              href="/dashboard/superadmin/admins"
              color="blue"
              icon="🏛️"
            />

            <Card
              title="Faculty"
              description="Assign and manage academic staff"
              href="/dashboard/superadmin/faculty"
              color="green"
              icon="👥"
            />

            <StudentCard />

            <div className="bg-white border border-gray-200 rounded-xl p-6 md:col-span-3 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Student Complaints
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                View and manage anonymous student grievances
              </p>
              <Link href="/dashboard/superadmin/complaints">
                <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
                  View Complaints
                </button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardShell>
    </Protected>
  );
}

function Card({
  title,
  description,
  href,
  color,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  color: "blue" | "green";
  icon?: string;
}) {
  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {icon && <span className="text-3xl mb-3 block">{icon}</span>}
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <Link href={href}>
        <button
          className={`w-full px-4 py-2.5 text-white rounded-lg text-sm font-medium transition ${colorMap[color]}`}
        >
          Manage
        </button>
      </Link>
    </div>
  );
}

function StudentCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-3xl mb-3 block">🎓</span>
      <h3 className="font-semibold text-gray-900 mb-2">
        Students
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Upload, view, and edit student records
      </p>
      <div className="space-y-3">
        <Link href="/dashboard/superadmin/students/upload">
          <button className="w-full m-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition shadow-sm hover:shadow-md">
            Upload Students
          </button>
        </Link>
        <Link href="/dashboard/superadmin/students/manage">
          <button className="w-full px-4 m-2 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm hover:shadow-md">
            Manage / Edit Students
          </button>
        </Link>
      </div>
    </div>
  );
}