"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Certificate {
  status: "pending" | "approved" | "rejected";
}

interface StudentMe {
  name: string;
  email: string;
  certificates?: Certificate[];
}

export default function StudentDashboard() {
  const [me, setMe] = useState<StudentMe | null>(null);

  useEffect(() => {
    fetch(`${API}/students/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMe);
  }, []);

  if (!me) return <p>Loading...</p>;

  const pending =
    me.certificates?.filter((c) => c.status === "pending").length || 0;
  const approved =
    me.certificates?.filter((c) => c.status === "approved").length || 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Welcome, {me.name}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Pending Certificates" value={pending} />
        <StatCard label="Approved Certificates" value={approved} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
