import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            let currentDate = new Date();
            let oneWeekBefore = new Date(currentDate);
            oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
            let oneMonthAfter = new Date(currentDate);
            oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);

            let { data, error } = await supabase
                .from('calendar')
                .select('*')
                .eq('category', 'event')
                .gte('date', oneWeekBefore.toISOString().split('T',1))
                .lte('date', oneMonthAfter.toISOString().split('T',1));

            if (error) {
                console.error('Error fetching events:', error);
            } else {
                setEvents(data);
            }
        }

        fetchEvents();
    }, []);

  return (
    <div className="events-list mt-20 mx-auto mb-20">
        <div className='events-header mb-10'> 
            <h1 className='events-title'>Upcoming Events</h1>
        </div>
        {events.map(event => (
            <EventItem key={event.id} event={event} />
        ))}
    </div>
  );
}

function EventItem({ event }) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return (
        <div className="event-item flex flex-row">
            <div className="date-box flex flex-col">
                <div>
                    {months[new Date(event.date).getMonth()]}
                </div>
                {new Date(event.date).getDate() + 1}
            </div>
            <div className="event-details flex flex-col">
                <span className="event-category">{event.category}</span>
                <div className='event-align flex flex-row text-center'>
                    <h2 className="event-title mr-4">{event.title}</h2>
                    <div>
                    <span className="event-timestamp">{formatStandardTime(event.start_time)}</span> &nbsp;-&nbsp; 
                    <span className="event-timestamp">{formatStandardTime(event.end_time)}</span>
                    </div>
                </div>
                <div className='event-description flex'>
                    <p>{event.description}</p>
                </div>
            </div>
        </div>
    );
}

function formatStandardTime(timeString) {
    // Assuming timeString is in 'HH:MM:SS' format
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // 'en-US' can be replaced with your locale if needed, and options can be adjusted as necessary
    const standardTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return standardTime;
}

export default Events;
