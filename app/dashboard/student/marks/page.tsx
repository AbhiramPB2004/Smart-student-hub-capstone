"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Mark {
  semester: number;
  subject: string;
  exam_type: string;
  marks_obtained: number;
  total_marks: number;
}

export default function StudentMarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    fetch(`${API}/students/marks`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMarks);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        My Marks
      </h1>

      <table className="w-full bg-white text-sm rounded">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Semester</th>
            <th>Subject</th>
            <th>Exam</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-3">{m.semester}</td>
              <td>{m.subject}</td>
              <td>{m.exam_type}</td>
              <td>
                {m.marks_obtained}/{m.total_marks}
              </td>
            </tr>
          ))}

          {marks.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                No marks uploaded yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
