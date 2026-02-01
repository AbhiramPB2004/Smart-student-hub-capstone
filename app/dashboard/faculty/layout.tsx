"use client";

import Link from "next/link";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-lg font-semibold mb-6">Faculty Panel</h2>

        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/dashboard/faculty" className="hover:underline">
            Dashboard
          </Link>

          <Link href="/dashboard/faculty/approvals" className="hover:underline">
            Pending Approvals
          </Link>

          <Link href="/dashboard/faculty/marks" className="hover:underline">
            Upload Marks
          </Link>
          <Link
  href="/dashboard/faculty/internships"
  className="hover:underline"
>
  Internship Approvals
          </Link>
          
          <Link
  href="/dashboard/faculty/projects"
  className="text-blue-600 hover:underline"
>
  ➜ Review Projects
          </Link>
          
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
