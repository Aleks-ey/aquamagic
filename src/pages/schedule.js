import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "font-awesome/css/font-awesome.min.css";
import Image from "next/image";

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    async function fetchSchedule() {
      let { data, error } = await supabase
        .from("calendar")
        .select("*")
        .eq("category", "schedule");

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setSchedule(data);
      }
    }

    fetchSchedule();
  }, []);

  useEffect(() => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0); // reset hours to start of the day
    startOfWeek.setDate(startOfWeek.getDate() + weekOffset);
    let days = [];
    for (let i = 0; i < 3; i++) {
      let day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    // setWeekDays(days);
    setWeekDays(days.map((d) => d.toISOString()));
  }, [weekOffset]);

  const formatDay = (isoString) => {
    let date = new Date(isoString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Convert to local time zone
    return date.toDateString();
  };

  const nextWeek = () => {
    setWeekOffset(weekOffset + 3);
  };
  const prevWeek = () => {
    setWeekOffset(weekOffset - 3);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-12 bg-white mt-12 md:pt-20 justify-center">
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
        <div className="flex flex-row w-full mt-8 justify-center">
          {/* <div className='flex flex-col md:flex-row mx-4 gap-x-4 w-full justify-center overflow-visible'>
                        {weekDays.map(isoDay => (
                            <div key={isoDay} className='flex flex-col my-2 md:my-2 md:w-1/3 h-80 border-2 border-black'>
                                <div className='flex p-2 bg-pool-water text-white justify-center'>
                                    {formatDay(isoDay).split(' ')[0] + ', ' + formatDay(isoDay).split(' ')[1] + ' ' + formatDay(isoDay).split(' ')[2]}
                                </div>
                                {schedule.filter(event => {
                                    let eventDate = new Date(event.date);
                                    eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset()); // Convert to local time
                                    return eventDate.toDateString() === formatDay(isoDay);
                                })
                                .map(event => (
                                    <div key={event.id} className='flex flex-col items-center p-2'>
                                        <div className='flex flex-row'>
                                            <h3 className=''>{event.title}</h3>
                                            &nbsp;<p>({event.coach})</p>
                                        </div>
                                        <div className='flex flex-row'>
                                        <p>{formatStandardTime(event.start_time)}</p>&nbsp;-&nbsp;<p>{formatStandardTime(event.end_time)}</p>
                                        </div>
                                        <hr className='w-4/5'/>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div> */}
          <div className="flex flex-col md:flex-row mx-4 gap-x-4 w-full justify-center overflow-visible">
            {weekDays.map((isoDay) => {
              const dayEvents = schedule.filter((event) => {
                let eventDate = new Date(event.date);
                eventDate.setMinutes(
                  eventDate.getMinutes() + eventDate.getTimezoneOffset()
                ); // Convert to local time
                return eventDate.toDateString() === formatDay(isoDay);
              });

              // Determine the location of the first event of the day
              const firstEvent = dayEvents[0]; // Get the first event if it exists
              const location = firstEvent ? firstEvent.location : "default";
              const locationName = firstEvent
                ? firstEvent.location
                : "No Lessons";

              // Set the color based on the location
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
      <div className="flex flex-col w-full">
        <div className="mb-12 mx-auto">
          <p className="text-2xl font-semibold text-center text-gray-400">
            Find a saveable copy of the schedule below
          </p>
        </div>
        <Image
          src="/schedules/BureAquaDec24.png"
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

function formatStandardTime(timeString) {
  // Assuming timeString is in 'HH:MM:SS' format
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

  // 'en-US' can be replaced with your locale if needed, and options can be adjusted as necessary
  const standardTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return standardTime;
}

export default Schedule;
