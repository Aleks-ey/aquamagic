import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "font-awesome/css/font-awesome.min.css";

/**
 * A helper to format a JS Date => "MMM d, yyyy" (like "Mar 7, 2025").
 * You can switch to your favorite format or locale.
 */
function formatDate(dateObj) {
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * If you want to display times in 12-hour format with AM/PM.
 * We'll parse "HH:MM:SS" from Supabase.
 */
function formatTime(timeString) {
  if (!timeString) return ""; // If there's no time, return empty
  const [hoursStr, minutesStr] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hoursStr, 10), parseInt(minutesStr, 10), 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function SwimMeets() {
  const [meets, setMeets] = useState([]);
  const [selectedMeet, setSelectedMeet] = useState(null);

  useEffect(() => {
    fetchMeets();
  }, []);

  async function fetchMeets() {
    const { data, error } = await supabase
      .from("calendar_meets")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching swim meets:", error);
      return;
    }

    if (data) {
      setMeets(data);
    }
  }

  /**
   * Returns a single string for the date or date range:
   * - If date_range == false, just show the "date"
   * - If date_range == true, show "start_date - end_date"
   *   (fallback if they're missing)
   */
  function getDisplayDate(meet) {
    if (meet.date_range) {
      // We assume `start_date` and `end_date` are present if date_range is true.
      // But let's gracefully handle missing data:
      const sDate = meet.start_date
        ? formatDate(new Date(meet.start_date))
        : null;
      const eDate = meet.end_date ? formatDate(new Date(meet.end_date)) : null;

      if (sDate && eDate) {
        return `${sDate} - ${eDate}`;
      } else if (sDate) {
        return sDate; // No end_date
      } else if (eDate) {
        return eDate; // No start_date
      } else {
        return "No dates provided";
      }
    } else {
      // Single date
      return meet.date ? formatDate(new Date(meet.date)) : "No date provided";
    }
  }

  /**
   * If meet.is_all_day == false and we have a start_time or end_time,
   * build a string like "9:00 AM - 11:00 AM" or "9:00 AM" if only start_time, etc.
   */
  function getDisplayTime(meet) {
    if (meet.is_all_day) {
      return "All Day";
    }

    const hasStart = !!meet.start_time;
    const hasEnd = !!meet.end_time;

    if (!hasStart && !hasEnd) {
      return ""; // no times
    } else if (hasStart && hasEnd) {
      return `${formatTime(meet.start_time)} - ${formatTime(meet.end_time)}`;
    } else if (hasStart) {
      return formatTime(meet.start_time);
    } else {
      return formatTime(meet.end_time);
    }
  }

  function openModal(meet) {
    setSelectedMeet(meet);
  }

  function closeModal() {
    setSelectedMeet(null);
  }

  return (
    <div className="w-full">
      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meets.map((meet) => {
          const dateString = getDisplayDate(meet);
          return (
            <div
              key={meet.id}
              className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => openModal(meet)}
            >
              <h2 className="text-xl font-semibold">{meet.title}</h2>
              <p className="text-gray-600">{dateString}</p>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedMeet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto p-6">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              <i className="fa fa-times fa-lg"></i>
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold mb-1">{selectedMeet.title}</h2>
            {/* Show date or range */}
            <p className="text-gray-700 mb-2">
              <strong>Date: </strong> {getDisplayDate(selectedMeet)}
            </p>
            {/* Show time if available */}
            {getDisplayTime(selectedMeet) && (
              <p className="text-gray-700 mb-2">
                <strong>Time: </strong> {getDisplayTime(selectedMeet)}
              </p>
            )}
            {/* Location */}
            {selectedMeet.location && (
              <p className="text-gray-700 mb-2">
                <strong>Location: </strong> {selectedMeet.location}
              </p>
            )}
            {/* Description */}
            {selectedMeet.description && (
              <div className="mb-4">
                <strong>Description:</strong>
                <p className="text-gray-700">{selectedMeet.description}</p>
              </div>
            )}
            {/* PDF URL */}
            {selectedMeet.pdfUrl && (
              <div className="mb-4">
                <strong>Info PDF:</strong>{" "}
                <a
                  href={selectedMeet.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Open PDF
                </a>
              </div>
            )}

            {/* Example: Exclude Dates */}
            {selectedMeet.exclude_dates && (
              <div className="mb-4">
                <strong>Excluded Dates:</strong>{" "}
                <p className="text-gray-700">{selectedMeet.exclude_dates}</p>
              </div>
            )}

            {/* Example: date_time_array (if you want to display or debug it) */}
            {selectedMeet.date_time_array && (
              <div className="mb-4">
                <strong>Additional Times:</strong>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(selectedMeet.date_time_array, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
