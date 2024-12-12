import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import AddEvent from "@/components/addEvent";
import EditEvent from "@/components/editEvent";
import DeleteEvent from "@/components/deleteEvent";

export default function Admin() {
  const handleEventSaved = () => {
    console.log("Event was saved successfully!");
    // Additional logic to handle after saving an event
  };

  return (
    <div className="admin_container">
      <AddEvent onEventSaved={handleEventSaved} />
      <EditEvent />
      <DeleteEvent />
    </div>
  );
}
