"use client";

import Protected from "@/components/Protected";
import DashboardShell from "@/components/DashboardShell";
import Link from "next/link";

export default function SuperAdminDashboard() {
  return (
    <Protected role="super_admin">
      <DashboardShell title="Super Admin Dashboard">
        <p className="text-black mb-6">
          Manage university users, academic operations, and grievances.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* University Admins */}
          <div className="bg-white p-5 shadow rounded-xl">
            <h3 className="text-black font-bold mb-2">
              University Admins
            </h3>
            <p className="text-sm text-black mb-4">
              Create & manage institution owners
            </p>

            <Link href="/dashboard/superadmin/admins">
              <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                Manage Admins
              </button>
            </Link>
          </div>

          {/* Faculty */}
          <div className="bg-white p-5 shadow rounded-xl">
            <h3 className="font-bold text-black mb-2">
              Faculty
            </h3>
            <p className="text-sm text-black mb-4">
              Assign and manage academic staff
            </p>

            <Link href="/dashboard/superadmin/faculty">
              <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
                Manage Faculty
              </button>
            </Link>
          </div>

          {/* Students */}
          <div className="bg-white p-5 shadow rounded-xl">
            <h3 className="font-bold text-black mb-2">
              Students
            </h3>
            <p className="text-sm text-black mb-4">
              Upload, view, and edit student records
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard/superadmin/students/upload">
                <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">
                  Upload Students
                </button>
              </Link>

              <Link href="/dashboard/superadmin/students/manage">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
                  Manage / Edit Students
                </button>
              </Link>
            </div>
          </div>

          {/* Complaints / Grievance */}
          <div className="bg-white p-5 shadow rounded-xl md:col-span-3">
            <h3 className="font-bold text-black mb-2">
              Student Complaints
            </h3>
            <p className="text-sm text-black mb-4">
              View and manage anonymous student grievances
            </p>

            <Link href="/dashboard/superadmin/complaints">
              <button className="bg-red-600 text-white px-4 py-2 rounded">
                View Complaints
              </button>
            </Link>
          </div>

        </div>
      </DashboardShell>
    </Protected>
  );
}
