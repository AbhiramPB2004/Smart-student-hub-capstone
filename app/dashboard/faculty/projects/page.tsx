"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Project {
  project_id: string;
  student_id: string;
  student_name: string;
  register_no: string;
  title: string;
  github_url: string;
  deployment_url?: string;
  submitted_at: string;
}

export default function FacultyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const res = await fetch(
      `${API}/faculty/projects/pending`,
      { credentials: "include" }
    );

    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const approve = async (id: string) => {
    await fetch(
      `${API}/faculty/projects/${id}/approve`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    fetchProjects();
  };

  const reject = async (id: string) => {
    const remarks = prompt("Reason for rejection?");
    if (!remarks) return;

    await fetch(
      `${API}/faculty/projects/${id}/reject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ remarks }),
      }
    );

    fetchProjects();
  };

  if (loading) {
    return <div>Loading project submissions...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Pending Project Submissions
      </h1>

      <div className="bg-white rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th>Register No</th>
              <th>Title</th>
              <th>Links</th>
              <th>Submitted</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr key={p.project_id} className="border-t">
                <td className="p-3">{p.student_name}</td>
                <td>{p.register_no}</td>
                <td className="font-medium">{p.title}</td>

                <td className="space-x-2">
                  <a
                    href={p.github_url}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    GitHub
                  </a>

                  {p.deployment_url && (
                    <a
                      href={p.deployment_url}
                      target="_blank"
                      className="text-green-600 underline"
                    >
                      Live
                    </a>
                  )}
                </td>

                <td>
                  {new Date(p.submitted_at).toLocaleDateString()}
                </td>

                <td className="text-center space-x-2">
                  <button
                    onClick={() => approve(p.project_id)}
                    className="text-green-600 underline"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(p.project_id)}
                    className="text-red-600 underline"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  No pending project submissions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
