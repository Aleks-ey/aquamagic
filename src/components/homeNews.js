import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "font-awesome/css/font-awesome.min.css";
import Image from "next/image";
import SwimMeets from "./swimMeets";

function HomeNews() {
  // Fetched + filtered announcements (both normal and banner)
  const [announcements, setAnnouncements] = useState([]);

  // Track banner dismissals (IDs)
  const [dismissedBanners, setDismissedBanners] = useState([]);

  // Next 3 schedule days
  const [schedule, setSchedule] = useState([]);

  // Upcoming events
  const [events, setEvents] = useState([]);

  // News
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await Promise.all([
      fetchAnnouncements(),
      fetchSchedule(),
      fetchEvents(),
      fetchNews(),
      // We fetch meets in <SwimMeets /> now
    ]);
  }

  // ----------------------------------------------------------------
  // ANNOUNCEMENTS
  // ----------------------------------------------------------------
  async function fetchAnnouncements() {
    try {
      const { data, error } = await supabase.from("announcements").select("*");
      if (error) throw error;

      // Filter out announcements that are not shown or outside date range
      const valid = (data || []).filter(isAnnouncementValid);
      // Sort so important appear first, then by ID desc
      valid.sort(sortAnnouncements);

      setAnnouncements(valid);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  }

  /**
   * Must have a.show === true
   * If it has start_date or end_date, must be in [start_date, end_date]
   */
  function isAnnouncementValid(a) {
    if (!a.show) return false;
    const now = new Date();

    if (a.start_date) {
      const start = new Date(a.start_date);
      if (now < start) return false;
    }
    if (a.end_date) {
      const end = new Date(a.end_date);
      if (now > end) return false;
    }
    return true;
  }

  // Important announcements come first, then fallback by ID descending
  function sortAnnouncements(a, b) {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return b.id - a.id;
  }

  // Called when user dismisses a banner
  function dismissBanner(id) {
    setDismissedBanners((prev) => [...prev, id]);
  }

  // ----------------------------------------------------------------
  // SCHEDULE
  // ----------------------------------------------------------------
  async function fetchSchedule() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("calendar_schedule")
      .select("*")
      .gte("date", today.toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Error fetching schedule:", error);
      return;
    }

    const groupedByDay = groupScheduleByDay(data);
    const nextThreeDays = groupedByDay.slice(0, 3);
    setSchedule(nextThreeDays);
  }

  function groupScheduleByDay(scheduleItems) {
    const groups = {};
    scheduleItems.forEach((item) => {
      const day = item.date;
      if (!groups[day]) groups[day] = [];
      groups[day].push(item);
    });

    return Object.keys(groups)
      .sort()
      .map((dateStr) => ({
        date: dateStr,
        items: groups[dateStr],
      }));
  }

  // ----------------------------------------------------------------
  // EVENTS
  // ----------------------------------------------------------------
  async function fetchEvents() {
    const today = new Date();
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("date", today.toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }
    setEvents(data || []);
  }

  // ----------------------------------------------------------------
  // NEWS
  // ----------------------------------------------------------------
  async function fetchNews() {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching news:", error);
      return;
    }
    setNewsItems(data || []);
  }

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------

  // 1) All announcements (banner or not) appear in announcements section
  // 2) Only banner announcements also appear pinned to the bottom,
  //    unless they’ve been dismissed.
  const bannerAnnouncements = announcements.filter(
    (a) => a.banner && !dismissedBanners.includes(a.id)
  );

  return (
    <div className="flex flex-col w-full mb-10 bg-white justify-center items-center relative">
      {/* PAGE HEADER */}
      <div className="flex flex-row self-start px-4 pt-4">
        <h1 className="text-4xl lg:text-5xl font-serif">News & Events</h1>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col w-full px-4 py-6 text-left bg-blue-100 rounded-lg">
        {/* 1. Announcements (ALL) */}
        <section className="mb-6">
          <h2 className="text-xl font-bold">Announcements</h2>
          {announcements.length === 0 ? (
            <p>No announcements at this time.</p>
          ) : (
            announcements.map((a) => (
              <div
                key={a.id}
                className="border-l-4 border-yellow-500 pl-2 py-2 my-2 bg-white"
              >
                {a.title && (
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                )}
                <p>{a.description}</p>
              </div>
            ))
          )}
        </section>

        {/* 2. Next 3 Schedule Days */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Next 3 Schedule Days</h2>
          {schedule.length === 0 ? (
            <p>No upcoming schedule items found.</p>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              {schedule.map((dayObj) => {
                const dayEvents = dayObj.items || [];
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
                const isoDay = `${dayObj.date}T00:00:00`;

                return (
                  <div
                    key={dayObj.date}
                    className="flex flex-col w-full md:w-1/3 border-2 border-black bg-white h-80"
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
                            <h3>{event.title}</h3>
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
          )}
        </section>

        {/* 3. Swim Meets */}
        <section className="mb-6">
          <h2 className="text-xl font-bold pb-2">Upcoming Swim Meets</h2>
          <SwimMeets />
        </section>

        {/* 4. News */}
        <section className="mb-6">
          <h2 className="text-xl font-bold">News</h2>
          {newsItems.length === 0 ? (
            <p>No news at this time.</p>
          ) : (
            newsItems.map((item) => (
              <div key={item.id} className="mb-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))
          )}
        </section>

        {/* 5. Upcoming Events */}
        <section className="mb-6">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          {events.length === 0 ? (
            <p>No upcoming events.</p>
          ) : (
            <ul>
              {events.map((ev) => (
                <li key={ev.id} className="mb-2">
                  <strong>{formatDatePretty(ev.date)}</strong>: {ev.title} @{" "}
                  {ev.location}
                  <br />
                  <small>{ev.details}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* PINNED BANNER ANNOUNCEMENTS at the BOTTOM */}
      {bannerAnnouncements.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-50 flex flex-col gap-2 items-center mb-2">
          {bannerAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-yellow-300 text-black p-4 w-[90%] md:w-2/3 lg:w-1/2 rounded-md shadow-md flex justify-between"
            >
              <div>
                {announcement.title && (
                  <h2 className="text-lg font-bold">{announcement.title}</h2>
                )}
                <p>{announcement.description}</p>
              </div>
              <button
                onClick={() => dismissBanner(announcement.id)}
                className="ml-4 text-black hover:text-gray-700"
              >
                <i className="fa fa-times fa-lg"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Helper to format ISO date into e.g. "Mon Mar 10 2025"
// ----------------------------------------------------------------
function formatDay(isoString) {
  const date = new Date(isoString);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date.toDateString();
}

// ----------------------------------------------------------------
// Helper to format 'HH:MM:SS' => "9:00 AM" style
// ----------------------------------------------------------------
function formatStandardTime(timeString) {
  if (!timeString) return "";
  const [hh, mm] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hh, 10), parseInt(mm, 10), 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ----------------------------------------------------------------
// Helper for events -> e.g. 'YYYY-MM-DD' => "Mon Mar 10 2025"
// ----------------------------------------------------------------
function formatDatePretty(yyyyMMdd) {
  if (!yyyyMMdd) return "";
  const [y, m, d] = yyyyMMdd.split("-");
  const date = new Date(+y, +m - 1, +d);
  return date.toDateString();
}

export default HomeNews;
