import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

function Calendar({ daysInfo }) {
    // calendar component
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date());  // New state for the selected day
    const [dateCategories, setDateCategories] = useState([]);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    const nextMonthFirstDate = 1;
    
    const totalDays = [...Array(firstDayOfMonth).keys()].map((_, idx) => prevMonthLastDate - firstDayOfMonth + idx + 1)
        .concat([...Array(daysInMonth).keys()].map((_, idx) => idx + 1))
        .concat([...Array(42 - daysInMonth - firstDayOfMonth).keys()].map((_, idx) => idx + 1));

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
    }

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
    }
  
    // Fetch events for the current month when the month changes
    useEffect(() => {
        async function fetchEvents() {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
        
            const { data, error } = await supabase
                .from('calendar')
                .select('*')
                .gte('date', startOfMonth)
                .lte('date', endOfMonth);
        
            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data || []);

                const dateCategoryMap = data.reduce((acc, event) => {
                    const dateKey = event.date;
                    if (!acc[dateKey]) acc[dateKey] = [];
                    if (!acc[dateKey].includes(event.category)) acc[dateKey].push(event.category);
                    return acc;
                }, {});
                
                setDateCategories(dateCategoryMap);
            }
        }        

        fetchEvents();
    }, [currentDate]);

    const handleDateClick = (date) => {
        const clickedDateObject = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
        setSelectedDay(clickedDateObject);  // Set the entire Date object

        const clickedDateISOString = clickedDateObject.toISOString().split('T')[0];
        const eventsOnDate = events.filter(event => event.date === clickedDateISOString);
        setSelectedDateEvents(eventsOnDate);
    }

    return (
        <div className="calendar-container flex flex-col md:flex md:flex-row mx-auto my-20 md:mt-32 md:mb-20">
            <div className='lg-calendar-container md:flex md:flex-col md:w-1/2'>
                <div className="calendar-header">
                    <button onClick={handlePrevMonth}>&lt;</button>
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    <button onClick={handleNextMonth}>&gt;</button>
                </div>

                <div className="calendar-grid">
                    {days.map(day => <div key={day} className="day-label">{day}</div>)}

                    {totalDays.map((date, idx) => {
                        // Check if this is a day in the current month
                        const isCurrentMonthDay = idx >= firstDayOfMonth && idx < firstDayOfMonth + daysInMonth;
                        // Calculate the actual date for this cell
                        const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
                        // Format the date as an ISO string for comparison
                        const cellDateISOString = cellDate.toISOString().split('T')[0];

                        return (
                            <div 
                                key={idx} 
                                className={
                                    `day-cell ${
                                        idx < firstDayOfMonth || idx >= daysInMonth + firstDayOfMonth ? 'outside' : ''
                                    } 
                                    ${
                                        (idx >= firstDayOfMonth && idx < daysInMonth + firstDayOfMonth && new Date(currentDate.getFullYear(), currentDate.getMonth(), date).toDateString() === selectedDay.toDateString()) ? 'selected' : ''
                                    } flex flex-col`
                                }
                                onClick={() => handleDateClick(date)}
                            >
                                {date}
                                <div className='flex flex-row'>
                                {
                                    // Check if the day is from the current month before showing categories
                                    isCurrentMonthDay && dateCategories[cellDateISOString]?.map((category) => {
                                        if (category === 'schedule') return <span key={category} className="dot bg-pool-water"></span>;
                                        if (category === 'Gateway') return <span key={category} className="dot bg-green-600"></span>;
                                        if (category === 'event') return <span key={category} className="dot bg-orange-400"></span>;
                                        if (category === 'swim meet') return <span key={category} className="dot bg-purple-400"></span>;
                                        // Add more categories as needed
                                    })
                                }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            
            {/* Display events for the selected date */}
            {selectedDateEvents.length > 0 && (
                <div className='md:flex md:flex-col md:w-1/2'>
                    <div className="cevents-list">
                    {selectedDateEvents.map(event => (
                        <div key={event.id} className="cevent-item flex flex-col p-4 bg-slate-100">
                            <div className='flex flex-row'>
                                <h3 className='cevent-title w-2/3'>{event.title}</h3> 
                                &nbsp; 
                                <p>(</p>
                                <p className='w-min whitespace-nowrap'>{formatStandardTime(event.start_time)}</p>
                                &nbsp;-&nbsp;
                                <p className='w-min whitespace-nowrap'>{formatStandardTime(event.end_time)}</p>
                                <p>)</p>
                            </div>
                            <hr/>
                            <p className='cevent-desc'>{event.description}</p>
                        </div>
                    ))}
                    </div>
                </div>
            )}
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

export default Calendar;
