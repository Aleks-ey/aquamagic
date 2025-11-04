import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "font-awesome/css/font-awesome.min.css";
import Image from "next/image";

// Helper to get "YYYY-MM" from a Date
function getYearMonth(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // e.g. "2025-03"
}

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [loadedMonths, setLoadedMonths] = useState([]);
  // This tracks which "YYYY-MM" months we've already fetched

  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState([]); // array of ISO strings for the 3 displayed days

  // --------------------------------------------------
  // 1. Determine the 3 displayed days (weekDays)
  // --------------------------------------------------
  useEffect(() => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() + weekOffset);

    const days = [];
    for (let i = 0; i < 3; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day.toISOString());
    }
    setWeekDays(days);
  }, [weekOffset]);

  // --------------------------------------------------
  // 2. Whenever the 3 displayed days change, figure
  //    out the months you need to load (±5-day buffer),
  //    and fetch them if not already fetched.
  // --------------------------------------------------
  useEffect(() => {
    if (weekDays.length === 0) return;

    // Find earliest & latest displayed day
    const earliest = new Date(
      Math.min(...weekDays.map((d) => new Date(d).getTime()))
    );
    const latest = new Date(
      Math.max(...weekDays.map((d) => new Date(d).getTime()))
    );

    // Extend the range by ±5 days
    earliest.setDate(earliest.getDate() - 5);
    latest.setDate(latest.getDate() + 5);

    // Collect all months from earliest -> latest
    const monthsToFetch = getAllMonthsInRange(earliest, latest);
    // Filter out months we've already loaded
    const newMonths = monthsToFetch.filter((m) => !loadedMonths.includes(m));

    if (newMonths.length > 0) {
      // Fetch data for each new month, then merge into our schedule
      newMonths.forEach((monthStr) => {
        fetchMonthSchedule(monthStr);
      });

      // Mark these months as loaded
      setLoadedMonths((prev) => [...prev, ...newMonths]);
    }
  }, [weekDays]);

  // --------------------------------------------------
  // 3. Fetch all schedule items for a given "YYYY-MM"
  //    from Supabase. Then merge them into schedule[].
  // --------------------------------------------------
  async function fetchMonthSchedule(yearMonth) {
    // yearMonth is e.g. "2025-03"
    // Create a start date = "2025-03-01"
    // and end date = "2025-03-31" or the actual last day of that month
    const [year, month] = yearMonth.split("-");
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDay = new Date(parseInt(year), parseInt(month), 0); // 0th day of next month

    // Convert to "YYYY-MM-DD" strings
    const startStr = formatDate(firstDay);
    const endStr = formatDate(lastDay);

    const { data, error } = await supabase
      .from("calendar")
      .select("*")
      .eq("category", "schedule")
      .gte("date", startStr)
      .lte("date", endStr);

    if (error) {
      console.error("Error fetching month:", yearMonth, error);
      return;
    }

    // Merge the newly fetched data with existing schedule
    setSchedule((prev) => [...prev, ...data]);
    console.log("Fetched", data.length, "events for", yearMonth);
  }

  // Helper: get all YYYY-MM strings in the range [startDate, endDate]
  function getAllMonthsInRange(startDate, endDate) {
    const startYear = startDate.getFullYear();
    const startMon = startDate.getMonth(); // 0-based
    const endYear = endDate.getFullYear();
    const endMon = endDate.getMonth();

    let year = startYear;
    let month = startMon;

    const months = [];
    while (year < endYear || (year === endYear && month <= endMon)) {
      months.push(`${year}-${String(month + 1).padStart(2, "0")}`);
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
    return months;
  }

  // Utility to format a Date as YYYY-MM-DD
  function formatDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Utility to display day nicely
  function formatDay(isoString) {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toDateString(); // e.g. "Mon Mar 10 2025"
  }

  // Utility for times (unchanged)
  function formatStandardTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const nextWeek = () => setWeekOffset((prev) => prev + 3);
  const prevWeek = () => setWeekOffset((prev) => prev - 3);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-12 bg-white mt-12 md:pt-20 justify-center">
        {/* Navigation Buttons (Desktop) */}
        <div className="hidden md:block relative w-full h-6">
          <button onClick={prevWeek} className="absolute top-0 left-4">
            <i className="fa fa-arrow-left mr-2"></i>
            Previous
          </button>
          <button onClick={nextWeek} className="absolute top-0 right-4">
            Next
            <i className="fa fa-arrow-right ml-2"></i>
          </button>
        </div>

        {/* Display the 3 Days */}
        <div className="flex flex-row w-full mt-8 justify-center">
          <div className="flex flex-col md:flex-row mx-4 gap-x-4 w-full justify-center overflow-visible">
            {weekDays.map((isoDay) => {
              // Filter the big schedule array for events that match this day
              const dayEvents = schedule.filter((event) => {
                const eventDate = new Date(event.date);
                eventDate.setMinutes(
                  eventDate.getMinutes() + eventDate.getTimezoneOffset()
                );
                return eventDate.toDateString() === formatDay(isoDay);
              });

              // Pick the first event for color / location label
              const firstEvent = dayEvents[0];
              const location = firstEvent ? firstEvent.location : "default";
              const locationName = firstEvent
                ? firstEvent.location
                : "No Lessons";

              const bgColor =
                location === "Rangeview"
                  ? "bg-pool-water"
                  : location === "Gateway"
                  ? "bg-green-500"
                  : "bg-black";

              return (
                <div
                  key={isoDay}
                  className="flex flex-col my-2 md:my-2 md:w-1/3 h-80 border-2 border-black"
                >
                  <div
                    className={`flex p-2 ${bgColor} text-white justify-center`}
                  >
                    {`${formatDay(isoDay).split(" ")[0]}, ${
                      formatDay(isoDay).split(" ")[1]
                    } ${formatDay(isoDay).split(" ")[2]} - ${locationName}`}
                  </div>
                  <div className="overflow-y-auto">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col items-center p-2"
                      >
                        <div className="flex flex-row">
                          <h3 className="">{event.title}</h3>
                          &nbsp;<p>({event.coach})</p>
                        </div>
                        <div className="flex flex-row">
                          <p>{formatStandardTime(event.start_time)}</p>
                          &nbsp;-&nbsp;
                          <p>{formatStandardTime(event.end_time)}</p>
                        </div>
                        <hr className="w-4/5" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons (Mobile) */}
        <div className="block md:hidden relative w-full mt-10 h-6">
          <button
            onClick={prevWeek}
            className="absolute top-0 left-10 scale-150"
          >
            <i className="fa fa-arrow-left mr-2"></i>
            Back
          </button>
          <button
            onClick={nextWeek}
            className="absolute top-0 right-10 scale-150"
          >
            Next
            <i className="fa fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>

      {/* Example "saveable" schedule image */}
      <div className="flex flex-col w-full">
        <div className="mb-12 mx-auto">
          <p className="text-2xl font-semibold text-center text-gray-400">
            Find a saveable copy of the schedule below
          </p>
        </div>
        <Image
          src="/schedules/BureAquaNov25.png"
          alt="Saveable Calendar"
          width="1000"
          height="450"
          priority={true}
          className="self-center w-auto h-auto"
        />
      </div>
    </div>
  );
}

export default Schedule;
