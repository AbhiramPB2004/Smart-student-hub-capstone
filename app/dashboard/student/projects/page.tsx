"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Faculty {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  status: string;
}

export default function StudentProjectsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");

  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [facultySearch, setFacultySearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH DATA
     ========================= */

  const fetchFaculty = async () => {
    const res = await fetch(`${API}/faculty/list`, {
      credentials: "include",
    });
    setFaculty(await res.json());
  };

  const fetchProjects = async () => {
    const res = await fetch(`${API}/students/projects`, {
      credentials: "include",
    });
    setProjects(await res.json());
  };

  useEffect(() => {
    fetchFaculty();
    fetchProjects();
  }, []);

  /* =========================
     FACULTY SEARCH + SELECT
     ========================= */

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.email.toLowerCase().includes(facultySearch.toLowerCase())
  );

  const toggleFaculty = (id: string) => {
    setSelectedFaculty((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  /* =========================
     SUBMIT PROJECT
     ========================= */

  const submitProject = async () => {
    if (!title || !description || !githubUrl || selectedFaculty.length === 0) {
      alert("Please fill all required fields and select faculty");
      return;
    }

    setLoading(true);

    await fetch(`${API}/students/projects/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        github_url: githubUrl,
        deployment_url: deployUrl || null,
        assigned_faculty_ids: selectedFaculty,
      }),
    });

    setLoading(false);
    setTitle("");
    setDescription("");
    setGithubUrl("");
    setDeployUrl("");
    setSelectedFaculty([]);
    setFacultySearch("");

    fetchProjects();
  };

  /* =========================
     UI
     ========================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Project Submission
      </h1>

      {/* ================= Submit Section ================= */}
      <div className="bg-white p-4 rounded mb-6 space-y-4">

        <input
          className="border p-2 w-full"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="GitHub Repository URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Deployment URL (optional)"
          value={deployUrl}
          onChange={(e) => setDeployUrl(e.target.value)}
        />

        {/* Faculty Search & Select */}
        <div>
          <label className="block font-medium mb-1">
            Assign Faculty
          </label>

          <input
            type="text"
            placeholder="Search faculty by name or email"
            value={facultySearch}
            onChange={(e) => setFacultySearch(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <div className="border rounded max-h-48 overflow-y-auto p-2 space-y-2">
            {filteredFaculty.map((f) => (
              <label
                key={f._id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFaculty.includes(f._id)}
                  onChange={() => toggleFaculty(f._id)}
                />
                <span>
                  {f.name}{" "}
                  <span className="text-xs text-gray-500">
                    ({f.email})
                  </span>
                </span>
              </label>
            ))}

            {filteredFaculty.length === 0 && (
              <p className="text-xs text-gray-500">
                No faculty found
              </p>
            )}
          </div>
        </div>

        <button
          onClick={submitProject}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Project"}
        </button>
      </div>

      {/* ================= Project List ================= */}
      <div className="bg-white rounded">
        {projects.map((p) => (
          <div key={p._id} className="border-b p-3">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">
              Status: {p.status}
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No projects submitted
          </div>
        )}
      </div>
    </div>
  );
}
