import { useState } from "react";

export default function ScheduleUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function handleUpload() {
    console.log("Sending secret:", process.env.NEXT_PUBLIC_AM_UPLOAD_SECRET);

    if (!file) return setStatus("Please pick a PNG file.");

    setStatus("Uploading...");

    const form = new FormData();
    form.append("file", file);

    const endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/uploadSchedule`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        mode: "cors",
        headers: {
          "x-admin-secret": process.env.NEXT_PUBLIC_AM_UPLOAD_SECRET,
        },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        setStatus(`Upload failed: ${text}`);
        return;
      }

      setStatus("Upload successful!");
    } catch (err) {
      console.error(err);
      setStatus("Upload failed. Check console.");
    }
  }

  return (
    <div className="my-20 p-6 border-2 border-black rounded-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl mb-4 text-center">Upload Monthly Schedule</h2>

      <input
        type="file"
        accept="image/png"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Upload Schedule
      </button>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}
