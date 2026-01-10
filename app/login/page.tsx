"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // REQUIRED for HttpOnly cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      // success — cookie is already set by backend
      window.location.href = "/dashboard/superadmin";

    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
<div
  className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
  style={{ backgroundImage: "url('/bg.png')" }}
>
  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

    <h2 className="text-2xl font-bold text-center text-black mb-6">
      Smart Student Hub Login
    </h2>

    {error && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      
      <div>
        <label className="block text-sm text-black mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm text-black mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Login"}
      </button>

    </form>

    <p className="text-xs text-gray-500 text-center mt-4">
      Authorized users only.
    </p>

  </div>
</div>
  );
}
