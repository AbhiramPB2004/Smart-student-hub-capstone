"use client";

export default function DashboardShell({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">
          Smart Student Hub
        </h2>

        <nav className="space-y-3">
          <a href="/dashboard" className="block hover:text-gray-300">
            Overview
          </a>
          <a href="/dashboard/superadmin" className="block hover:text-gray-300">
            Super Admin
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-100 p-8">

        <h1 className="text-3xl text-black font-bold mb-4">{title}</h1>

        {children}

      </main>
    </div>
  );
}
