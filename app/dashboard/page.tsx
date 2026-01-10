"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRouter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { credentials: "include" }
        );

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        switch (data.role) {
          case "super_admin":
            router.push("/dashboard/superadmin");
            break;

          case "admin":
            router.push("/dashboard/admin");
            break;

          case "faculty":
            router.push("/dashboard/faculty");
            break;

          case "student":
            router.push("/dashboard/student");
            break;

          default:
            router.push("/login");
        }

      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading dashboard…</p>;

  return null;
}
