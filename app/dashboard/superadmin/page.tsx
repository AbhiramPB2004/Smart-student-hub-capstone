"use client";

import Protected from "@/components/Protected";
import DashboardShell from "@/components/DashboardShell";
import Link from "next/link";


export default function SuperAdminDashboard() {
  return (
    <Protected role="super_admin">
      <DashboardShell  title="Super Admin Dashboard">

        <p className="text-black  text-blackmb-6">
          Manage system-wide users and institutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-5 shadow rounded-xl">
            <h3 className=" text-black font-bold mb-2">University Admins</h3>
            <p className="text-sm text-black mb-3">
              Create & manage institution owners
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Manage Admins
            </button>
          </div>

          <div className="bg-white p-5 shadow rounded-xl">
            <h3 className="font-bold  text-black mb-2">Faculty</h3>
            <p className="text-sm text-gray-600 mb-3">
              Assign academic staff roles
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Manage Faculty
            </button>
          </div>

          <div className="bg-white p-5 shadow rounded-xl">
            <h3 className="font-bold mb-2 text-black ">Students</h3>
            <p className="text-sm text-gray-600 mb-3">
              View and verify records
            </p>
            <Link href="/dashboard/superadmin/students/upload">
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              Manage Students
              </button>
            </Link>
          </div>

        </div>

      </DashboardShell>
    </Protected>
  );
}
