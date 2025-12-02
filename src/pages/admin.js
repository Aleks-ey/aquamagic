import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import AddEvent from "@/components/addEvent";
import EditEvent from "@/components/editEvent";
import DeleteEvent from "@/components/deleteEvent";
import ScheduleUpload from "@/components/scheduleUpload";

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleLogin = () => {
    if (password === correctPassword) {
      setAuthorized(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!authorized) {
    return (
      <div className="mt-40 flex flex-col justify-center items-center">
        <h1 className="text-3xl mb-6 font-bold">Admin Login</h1>

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-black px-3 py-2 rounded-md mb-4"
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Enter
        </button>
      </div>
    );
  }

  // If authorized → show full admin panel
  return (
    <div className="admin_container">
      <AddEvent onEventSaved={() => console.log("Event saved")} />
      <EditEvent />
      <DeleteEvent />
      <ScheduleUpload />
    </div>
  );
}
