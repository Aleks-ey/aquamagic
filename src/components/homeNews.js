// import React, { useState, useEffect } from "react";
// import { supabase } from "../utils/supabaseClient";
// import "font-awesome/css/font-awesome.min.css";
// import Image from "next/image";
// import SwimMeets from "./swimMeets";

// function HomeNews() {
//   // 1. Admin message
//   const [announcements, setAnnouncements] = useState([]);
//   const [bannerAnnouncements, setBannerAnnouncements] = useState([]);
//   // Track which banner announcements have been dismissed
//   const [dismissedBanners, setDismissedBanners] = useState([]);

//   // 2. Next 3 schedule days
//   //    Instead of just listing them with bullet points,
//   //    we’ll display them with the same style used in Schedule.js
//   const [schedule, setSchedule] = useState([]);

//   // 3. Upcoming events
//   const [events, setEvents] = useState([]);

//   // 4. News
//   const [newsItems, setNewsItems] = useState([]);

//   // 5. Swim meets
//   const [meets, setMeets] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   async function fetchData() {
//     await Promise.all([
//       fetchAnnouncements(),
//       fetchSchedule(),
//       fetchEvents(),
//       fetchNews(),
//       //   fetchMeets(),
//     ]);
//   }

//   // ----------------------------------------------------------------
//   // 1. Admin Message
//   // ----------------------------------------------------------------
//   //   async function fetchAnnouncements() {
//   //     const { data, error } = await supabase
//   //       .from("announcements")
//   //       .select("*")
//   //       .order("created_at", { ascending: false })
//   //       .limit(1);

//   //     if (error) {
//   //       console.error("Error fetching admin message:", error);
//   //       return;
//   //     }

//   //     if (data && data.length > 0) {
//   //       setAnnouncements(data[0].message);
//   //     } else {
//   //       setAnnouncements("No announcements at this time.");
//   //     }
//   //   }
//   // ----------------------------------------------------------------
//   // ANNOUNCEMENTS
//   // ----------------------------------------------------------------
//   async function fetchAnnouncements() {
//     // columns: id, show, important, banner, title, description,
//     //          start_date, end_date
//     const { data, error } = await supabase.from("announcements").select("*");

//     if (error) {
//       console.error("Error fetching announcements:", error);
//       return;
//     }

//     if (!data) return;

//     // Filter out announcements that are NOT set to show or not in date range
//     const valid = data.filter(isAnnouncementValid);

//     // Separate banner announcements from normal ones
//     const banners = valid.filter((a) => a.banner);
//     const normal = valid.filter((a) => !a.banner);

//     // Sort both arrays so "important" ones come first
//     // important: true -> sort higher
//     banners.sort((a, b) => sortAnnouncements(a, b));
//     normal.sort((a, b) => sortAnnouncements(a, b));

//     setBannerAnnouncements(banners);
//     setAnnouncements(normal);
//   }

//   /**
//    * Checks:
//    * 1) a.show must be true
//    * 2) if start_date or end_date exist, now must be in [start_date, end_date]
//    *    - if only start_date is present, now >= start_date
//    *    - if only end_date is present, now <= end_date
//    */
//   function isAnnouncementValid(a) {
//     if (!a.show) return false;

//     const now = new Date();
//     // If start_date exists, compare
//     if (a.start_date) {
//       const start = new Date(a.start_date);
//       if (now < start) return false; // not started yet
//     }
//     // If end_date exists, compare
//     if (a.end_date) {
//       const end = new Date(a.end_date);
//       if (now > end) return false; // ended
//     }
//     return true;
//   }

//   /**
//    * Sort by "important" first, then by maybe descending date or ID if you want.
//    * Here, we'll just sort important: true > false. If both have the same, sort by id descending for example.
//    */
//   function sortAnnouncements(a, b) {
//     if (a.important && !b.important) return -1;
//     if (!a.important && b.important) return 1;
//     // fallback: let's just sort by descending id
//     return b.id - a.id;
//   }

//   // On banner close, add that ID to dismissed list
//   function dismissBanner(id) {
//     setDismissedBanners((prev) => [...prev, id]);
//   }

//   // ----------------------------------------------------------------
//   // 2. Next 3 schedule days (starting from today)
//   // ----------------------------------------------------------------
//   async function fetchSchedule() {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Fetch up to 10 schedule items from "calendar_schedule"
//     // that occur today or later.
//     const { data, error } = await supabase
//       .from("calendar_schedule")
//       .select("*")
//       .gte("date", today.toISOString().split("T")[0]) // >= today's date
//       .order("date", { ascending: true })
//       .limit(10);

//     if (error) {
//       console.error("Error fetching schedule:", error);
//       return;
//     }

//     // Group by day
//     const groupedByDay = groupScheduleByDay(data);
//     // Then slice the first 3 days
//     const nextThreeDays = groupedByDay.slice(0, 3);
//     setSchedule(nextThreeDays);
//   }

//   // Helper to group schedule by day
//   function groupScheduleByDay(scheduleItems) {
//     const groups = {};
//     scheduleItems.forEach((item) => {
//       const day = item.date; // 'YYYY-MM-DD' from Supabase
//       if (!groups[day]) {
//         groups[day] = [];
//       }
//       groups[day].push(item);
//     });

//     // Convert to an array of { date: 'YYYY-MM-DD', items: [...] },
//     // sorted by date ascending
//     return Object.keys(groups)
//       .sort()
//       .map((dateStr) => ({
//         date: dateStr,
//         items: groups[dateStr],
//       }));
//   }

//   // ----------------------------------------------------------------
//   // 3. Swim meets
//   // ----------------------------------------------------------------
//   //   async function fetchMeets() {
//   //     const today = new Date();
//   //     const { data, error } = await supabase
//   //       .from("calendar_meets")
//   //       .select("*")
//   //       .gte("date", today.toISOString().split("T")[0]) // upcoming meets
//   //       .order("date", { ascending: true })
//   //       .limit(3);

//   //     if (error) {
//   //       console.error("Error fetching swim meets:", error);
//   //       return;
//   //     }

//   //     setMeets(data || []);
//   //   }

//   // ----------------------------------------------------------------
//   // 4. News
//   // ----------------------------------------------------------------
//   async function fetchNews() {
//     const { data, error } = await supabase
//       .from("news")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .limit(5);

//     if (error) {
//       console.error("Error fetching news:", error);
//       return;
//     }

//     setNewsItems(data || []);
//   }

//   // ----------------------------------------------------------------
//   // 5. Upcoming events
//   // ----------------------------------------------------------------
//   async function fetchEvents() {
//     const today = new Date();
//     const { data, error } = await supabase
//       .from("calendar_events")
//       .select("*")
//       .gte("date", today.toISOString().split("T")[0])
//       .order("date", { ascending: true })
//       .limit(5);

//     if (error) {
//       console.error("Error fetching events:", error);
//       return;
//     }

//     setEvents(data || []);
//   }

//   // ----------------------------------------------------------------
//   // Rendering
//   // ----------------------------------------------------------------
//   return (
//     <div className="flex flex-col w-full mb-10 bg-white justify-center items-center">
//       {/* BANNER ANNOUNCEMENTS (DISMISSIBLE) */}
//       {bannerAnnouncements
//         .filter((a) => !dismissedBanners.includes(a.id)) // hide if dismissed
//         .map((announcement) => (
//           <div
//             key={announcement.id}
//             className="w-full bg-yellow-300 text-black p-4 flex items-center justify-between"
//           >
//             <div className="flex flex-col">
//               {announcement.title && (
//                 <h2 className="text-lg font-bold">{announcement.title}</h2>
//               )}
//               <p>{announcement.description}</p>
//             </div>
//             <button
//               onClick={() => dismissBanner(announcement.id)}
//               className="text-black ml-4 hover:text-gray-700"
//             >
//               <i className="fa fa-times fa-lg"></i>
//             </button>
//           </div>
//         ))}

//       <div className="flex flex-row self-start">
//         <h1 className="text-4xl lg:text-5xl text-left font-serif my-8">
//           News & Events
//         </h1>
//       </div>
//       {/* CONTENT */}
//       <div className="flex flex-col w-full px-4 py-6 text-left bg-blue-100 rounded-lg">
//         {/* 1. Admin Message */}
//         <section className="mb-6">
//           <h2 className="text-xl font-bold">Announcements</h2>
//           {/* <p>{announcements || "No announcements found."}</p> */}
//           {/* (Optional) List Non-Banner Announcements Above Everything If You Wish */}
//           {announcements.length > 0 && (
//             <section className="mb-6">
//               <h2 className="text-xl font-bold">Announcements</h2>
//               {announcements.map((a) => (
//                 <div
//                   key={a.id}
//                   className="border-l-4 border-yellow-500 pl-2 py-2 my-2 bg-white"
//                 >
//                   {a.title && (
//                     <h3 className="text-lg font-semibold">{a.title}</h3>
//                   )}
//                   <p>{a.description}</p>
//                 </div>
//               ))}
//             </section>
//           )}
//         </section>

//         {/* 2. Next 3 Schedule Days - styled like schedule.js */}
//         <section className="mb-6">
//           <h2 className="text-xl font-bold mb-2">Next 3 Schedule Days</h2>

//           {schedule.length === 0 ? (
//             <p>No upcoming schedule items found.</p>
//           ) : (
//             // We'll mimic schedule.js by displaying each day in a "card" with location color and times
//             <div className="flex flex-col md:flex-row gap-4 justify-center">
//               {schedule.map((dayObj) => {
//                 // dayObj = { date: 'YYYY-MM-DD', items: [...] }
//                 const dayEvents = dayObj.items || [];

//                 // Determine location color from the first event
//                 const firstEvent = dayEvents[0];
//                 const location = firstEvent ? firstEvent.location : "default";
//                 const locationName = firstEvent
//                   ? firstEvent.location
//                   : "No Lessons";

//                 // We'll replicate the same color logic:
//                 const bgColor =
//                   location === "Rangeview"
//                     ? "bg-pool-water"
//                     : location === "Gateway"
//                     ? "bg-green-500"
//                     : "bg-black";

//                 // We'll build an ISO string so we can format it like schedule.js
//                 // (We only have 'YYYY-MM-DD', so let's assume midnight)
//                 const isoDay = `${dayObj.date}T00:00:00`;

//                 return (
//                   <div
//                     key={dayObj.date}
//                     className="flex flex-col w-full md:w-1/3 border-2 border-black h-80"
//                   >
//                     {/* Header with date and location */}
//                     <div
//                       className={`flex p-2 ${bgColor} text-white justify-center`}
//                     >
//                       {`${formatDay(isoDay).split(" ")[0]}, ${
//                         formatDay(isoDay).split(" ")[1]
//                       } ${formatDay(isoDay).split(" ")[2]} - ${locationName}`}
//                     </div>

//                     {/* Events listing */}
//                     <div className="overflow-y-auto h-full bg-white">
//                       {dayEvents.map((event) => (
//                         <div
//                           key={event.id}
//                           className="flex flex-col items-center p-2"
//                         >
//                           <div className="flex flex-row">
//                             <h3>{event.title}</h3>
//                             &nbsp;<p>({event.coach})</p>
//                           </div>
//                           <div className="flex flex-row">
//                             <p>{formatStandardTime(event.start_time)}</p>
//                             &nbsp;-&nbsp;
//                             <p>{formatStandardTime(event.end_time)}</p>
//                           </div>
//                           <hr className="w-4/5" />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         {/* 3. Swim Meets */}
//         <section className="mb-6">
//           <h2 className="text-xl font-bold pb-2">Upcoming Swim Meets</h2>
//           {/* {meets.length === 0 ? (
//             <p>No upcoming meets.</p>
//           ) : (
//             meets.map((meet) => (
//               <div key={meet.id} className="mb-4">
//                 <p className="font-semibold">{meet.meet_name}</p>
//                 <p>
//                   Date: {formatDatePretty(meet.date)} @ {meet.location}
//                 </p>
//                 <p>Teams: {meet.teams}</p>
//               </div>
//             ))
//           )} */}
//           <SwimMeets />
//         </section>

//         {/* 4. News */}
//         <section className="mb-6">
//           <h2 className="text-xl font-bold">News</h2>
//           {newsItems.length === 0 ? (
//             <p>No news at this time.</p>
//           ) : (
//             newsItems.map((item) => (
//               <div key={item.id} className="mb-4">
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p>{item.content}</p>
//               </div>
//             ))
//           )}
//         </section>

//         {/* 5. Upcoming Events */}
//         <section className="mb-6">
//           <h2 className="text-xl font-bold">Upcoming Events</h2>
//           {events.length === 0 ? (
//             <p>No upcoming events.</p>
//           ) : (
//             <ul>
//               {events.map((ev) => (
//                 <li key={ev.id} className="mb-2">
//                   <strong>{formatDatePretty(ev.date)}</strong>: {ev.title} @{" "}
//                   {ev.location}
//                   <br />
//                   <small>{ev.details}</small>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

// /**
//  * Replicates the logic in schedule.js for formatting the day.
//  * We'll produce something like "Mon Mar 10 2025"
//  */
// function formatDay(isoString) {
//   const date = new Date(isoString);
//   // Convert to local time
//   date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
//   return date.toDateString();
// }

// /**
//  * Same function as in schedule.js to convert 'HH:MM:SS' into
//  * standard 12-hour time, e.g. "9:00 AM"
//  */
// function formatStandardTime(timeString) {
//   const [hours, minutes] = timeString.split(":");
//   const date = new Date();
//   date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
//   return date.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// }

// /**
//  * A simpler pretty date for events, meets, etc.
//  * If you'd rather see "Mon Mar 10 2025", just use formatDay()
//  */
// function formatDatePretty(yyyyMMdd) {
//   const [year, month, day] = yyyyMMdd.split("-");
//   const date = new Date(+year, +month - 1, +day);
//   return date.toDateString(); // e.g. "Mon Mar 10 2025"
// }

// export default HomeNews;

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
                    className="flex flex-col w-full md:w-1/3 border-2 border-black h-80"
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
