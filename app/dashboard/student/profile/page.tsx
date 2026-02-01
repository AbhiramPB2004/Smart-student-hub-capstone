"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function StudentProfilePage() {
  const [form, setForm] = useState({
    phone: "",
    dob: "",
    gender: "",
    blood_group: "",
    address: "",
    current_year: "",
    semester: "",
    photo_url: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔼 Upload photo → GridFS
  const uploadPhoto = async () => {
    if (!photo) {
      alert("Select an image");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    setUploading(true);

    const res = await fetch(`${API}/students/profile/photo`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      alert(data.detail || "Upload failed");
      return;
    }

    setForm((prev) => ({
      ...prev,
      photo_url: data.photo_url,
    }));
  };

  // 💾 Save profile
  const saveProfile = async () => {
    if (!form.photo_url) {
      alert("Upload profile photo first");
      return;
    }

    const res = await fetch(`${API}/students/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Failed");
      return;
    }

    window.location.href = "/dashboard/student";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded">
      <h1 className="text-2xl font-semibold mb-6">
        Complete Your Profile
      </h1>

      <input name="phone" placeholder="Phone" className="border p-2 w-full mb-3" onChange={handleChange} />
      <input name="dob" type="date" className="border p-2 w-full mb-3" onChange={handleChange} />

      <select name="gender" className="border p-2 w-full mb-3" onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input name="blood_group" placeholder="Blood Group" className="border p-2 w-full mb-3" onChange={handleChange} />
      <textarea name="address" placeholder="Address" className="border p-2 w-full mb-3" onChange={handleChange} />

      <input name="current_year" type="number" placeholder="Current Year" className="border p-2 w-full mb-3" onChange={handleChange} />
      <input name="semester" type="number" placeholder="Semester" className="border p-2 w-full mb-4" onChange={handleChange} />

      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        className="mb-2"
      />

      <button
        onClick={uploadPhoto}
        disabled={uploading}
        className="bg-gray-600 text-white px-4 py-2 rounded mb-4"
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>

      {form.photo_url && (
        <img
          src={`${API}${form.photo_url}`}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}

      <button
        onClick={saveProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save & Continue
      </button>
    </div>
  );
}
