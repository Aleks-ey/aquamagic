import { useState, useEffect } from 'react';
import DatePicker from "react-multi-date-picker";
import { supabase } from '../utils/supabaseClient';

function AddEvent({ selectedEventId = null}) {
    // State for event details
    const [dates, setDates] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [coach, setCoach] = useState('');
    const [category, setCategory] = useState('event');
    const [isAllDay, setIsAllDay] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventsByDate, setEventsByDate] = useState([]);

    // Reset form fields
    const resetForm = () => {
        setDates([]);
        setTitle('');
        setDescription('');
        setLocation('');
        setCoach('');
        setCategory('event');
        setIsAllDay(false);
        setStartTime('');
        setEndTime('');
    };

    // Fetch events based on selected dates
    useEffect(() => {
        if (dates.length > 0) {
            const fetchEventsByDate = async () => {
                const formattedDates = dates.map(date => date.format("YYYY-MM-DD"));
                const { data, error } = await supabase
                    .from('calendar')
                    .select('*')
                    .in('date', formattedDates);

                if (!error && data) {
                    setEventsByDate(data);
                }
            };

            fetchEventsByDate();
        }
    }, [dates]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const event = {
            title,
            description,
            location,
            category,
            is_all_day: isAllDay,
            start_time: startTime,
            end_time: endTime,
            ...(category === 'schedule' && { coach })
        };

        let error = null;

        if (selectedEventId) {
            const { error: updateError } = await supabase
                .from('calendar')
                .update(event)
                .match({ id: selectedEventId });
            error = updateError;
        } else {
            for (let date of dates) {
                const { error: insertError } = await supabase
                    .from('calendar')
                    .insert([{ ...event, date: date.format("YYYY-MM-DD") }]);
                if (insertError) {
                    error = insertError;
                    break;
                }
            }
        }

        if (!error) {
            onEventSaved(); // Ensure this is passed as a prop from the parent component
            resetForm();
        } else {
            console.error("Error saving event:", error);
        }
    };

    // Function to handle selection of an event suggestion
    const handleSuggestionClick = (event) => {
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setCategory(event.category);
        setIsAllDay(event.is_all_day);
        setStartTime(event.start_time);
        setEndTime(event.end_time);
        setCoach(event.coach);
        // Set dates if necessary, e.g., converting event.date to the required format
    };

    return (
        <div className='add_event_container flex flex-col my-28 items-center justify-center'>
            <h1 className='text-2xl'>Add Events</h1>
            <hr className="border-black w-1/4 self-center justify-center"/>
            <form onSubmit={handleSubmit} className="w-full max-w-lg mt-4">
                <table className="min-w-full divide-y divide-gray-500">
                    <tbody className="bg-white divide-y divide-gray-500">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>Select Dates:</label>
                            </td>
                            <td className="px-6 py-4">
                                <DatePicker 
                                    value={dates} 
                                    onChange={setDates} 
                                    multiple
                                    className="border border-black rounded-md" 
                                    style={{ width: '100%' }} 
                                />
                                {dates.length === 1 && eventsByDate.map(event => (
                                    <div key={event.id} onClick={() => handleSuggestionClick(event)} className="event_suggestion">
                                        {event.title}
                                    </div>
                                ))}
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
                        {category === 'schedule' && (
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
                        {selectedEventId ? 'Edit Event' : 'Add Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddEvent;

