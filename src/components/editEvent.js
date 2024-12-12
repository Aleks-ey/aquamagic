import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import { supabase } from "../utils/supabaseClient";

function EditEvent({ selectedEventId, onEventUpdated }) {
  const [dates, setDates] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coach, setCoach] = useState("");
  const [category, setCategory] = useState("event");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (selectedEventId) {
      const fetchEvent = async () => {
        const { data, error } = await supabase
          .from("calendar")
          .select("*")
          .eq("id", selectedEventId)
          .single();

        if (!error && data) {
          setTitle(data.title);
          setDescription(data.description);
          setLocation(data.location);
          setCategory(data.category);
          setIsAllDay(data.is_all_day);
          setStartTime(data.start_time);
          setEndTime(data.end_time);
          setCoach(data.coach || "");
          setDates([new Date(data.date)]); // Assuming single date; adapt as needed
        } else {
          console.error("Error fetching event data:", error);
        }
      };

      fetchEvent();
    }
  }, [selectedEventId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setCategory("event");
    setIsAllDay(false);
    setStartTime("");
    setEndTime("");
    setCoach("");
    setDates([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEvent = {
      title,
      description,
      location,
      category,
      is_all_day: isAllDay,
      start_time: startTime,
      end_time: endTime,
      ...(category === "schedule" && { coach }),
      date: dates[0]?.format("YYYY-MM-DD"), // Assuming single date; adjust if necessary
    };

    const { error } = await supabase
      .from("calendar")
      .update(updatedEvent)
      .match({ id: selectedEventId });

    if (!error) {
      onEventUpdated(); // Trigger callback to update the parent component or refresh data
      resetForm();
    } else {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="edit_event_container flex flex-col my-28 items-center justify-center">
      <h1 className="text-2xl">Edit Event</h1>
      <hr className="border-black w-1/4 self-center justify-center" />
      <form onSubmit={handleSubmit} className="w-full max-w-lg mt-4">
        <table className="min-w-full divide-y divide-gray-500">
          <tbody className="bg-white divide-y divide-gray-500">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>Select Date:</label>
              </td>
              <td className="px-6 py-4">
                <DatePicker
                  value={dates}
                  onChange={setDates}
                  multiple={false}
                  className="border border-black rounded-md"
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>Category:</label>
              </td>
              <td className="px-6 py-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="event">Event</option>
                  <option value="schedule">Schedule</option>
                  <option value="swim meet">Swim Meet</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>Title:</label>
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>Description:</label>
              </td>
              <td className="px-6 py-4">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>Location:</label>
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </td>
            </tr>
            {category === "schedule" && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <label>Coach:</label>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </td>
              </tr>
            )}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>Start Time:</label>
              </td>
              <td className="px-6 py-4">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isAllDay}
                  className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>End Time:</label>
              </td>
              <td className="px-6 py-4">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isAllDay}
                  className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <label>All Day Event:</label>
              </td>
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="mt-1"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEvent;
