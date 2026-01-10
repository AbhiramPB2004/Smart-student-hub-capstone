"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";

export default function Protected({
  children,
  role
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {
      const me = await getCurrentUser();
      console.log(me);

      if (!me) {
        window.location.href = "/login";
        return;
      }

      if (role && me.role !== role) {
        alert("Unauthorized" + me.role);
        window.location.href = "/dashboard";
        return;
      }

      setUser(me);
      setLoading(false);
    }

    load();

  }, [role]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return <>{children}</>;
}
