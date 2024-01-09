import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import DatePicker from "react-multi-date-picker";

export default function Admin() {
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
    const [selectedEventId, setSelectedEventId] = useState(null); // For editing
    const [eventsByDate, setEventsByDate] = useState([]); // For title suggestions

    // Fetch events for title suggestions
    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('calendar')
                .select('*')
                .in('date', dates.map(date => date.format("YYYY-MM-DD")));

            if (!error && data) {
                setEventsByDate(data);
            }
        };

        if (dates.length > 0) {
            fetchEvents();
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
            ...(category === 'schedule' && { coach }) // Add coach if category is 'schedule'
        };

        if (selectedEventId) {
            // Update existing event
            const { error } = await supabase
                .from('calendar')
                .update(event)
                .match({ id: selectedEventId });

            if (error) {
                console.error("Error updating event:", error);
            }
        } else {
            // Add new event(s)
            for (let date of dates) {
                const { error } = await supabase
                    .from('calendar')
                    .insert([{ ...event, date: date.format("YYYY-MM-DD") }]);

                if (error) {
                    console.error("Error inserting event:", error);
                    break; // stop the loop if there's an error
                }
            }
        }

        // Clear form fields after successful insert/update
        resetForm();
    };

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
        setSelectedEventId(null);
    };

    // Handle title selection from suggestions
    const handleSuggestionClick = (event) => {
        setSelectedEventId(event.id);
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setCategory(event.category);
        setIsAllDay(event.is_all_day);
        setStartTime(event.start_time);
        setEndTime(event.end_time);
        setCoach(event.coach);
    };

    // Function to determine if the suggestions should be shown
    const shouldShowSuggestions = () => {
        return dates.length === 1;
    };

    // Function to change the button text based on title and selectedEventId
    const getButtonText = () => {
        if (selectedEventId) return 'Edit Event';
        return title ? 'Add Event' : 'Select Date';
    };

    return (
        <div className='admin_container flex flex-col my-28 items-center justify-center'>
            <h1 className='text-2xl'>Add Events</h1>
            <hr className="border-black w-1/4 self-center justify-center"/>
            <form onSubmit={handleSubmit} className="w-full max-w-lg mt-4">
                <table className="min-w-full divide-y divide-gray-500">
                    <tbody className="bg-white divide-y divide-gray-500">
                        {/* Date Picker */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>Select Dates:</label>
                            </td>
                            <td className="px-6 py-4">
                                <DatePicker 
                                    value={dates} 
                                    onChange={setDates} 
                                    multiple
                                    className="border border-black rounded-md" // Custom CSS class
                                    style={{ width: '100%' }} // Inline style to match width with other inputs
                                />
                                {shouldShowSuggestions() && eventsByDate.map((event, index) => (
                                    <div key={index} onClick={() => handleSuggestionClick(event)} className="cursor-pointer text-blue-600 hover:text-blue-800">
                                        {event.title}
                                    </div>
                                ))}
                            </td>
                        </tr>
                        
                        {/* Category Dropdown */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>Category:</label>
                            </td>
                            <td className="px-6 py-4">
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="event">Event</option>
                                    <option value="schedule">Schedule</option>
                                    <option value="swim meet">Swim Meet</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="deadline">Deadline</option>
                                </select>
                            </td>
                        </tr>

                        {/* Title Field */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>Title:</label>
                            </td>
                            <td className="px-6 py-4">
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </td>
                        </tr>

                        {/* Description Field */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>Description:</label>
                            </td>
                            <td className="px-6 py-4">
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                            </td>
                        </tr>

                        {/* Location Field */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>Location:</label>
                            </td>
                            <td className="px-6 py-4">
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </td>
                        </tr>

                        {/* Conditional Coach Field */}
                        {category === 'schedule' && (
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <label>Coach:</label>
                                </td>
                                <td className="px-6 py-4">
                                    <input type="text" value={coach} onChange={(e) => setCoach(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </td>
                            </tr>
                        )}

                        {/* Start Time Field */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>Start Time:</label>
                            </td>
                            <td className="px-6 py-4">
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={isAllDay} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </td>
                        </tr>

                        {/* End Time Field */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>End Time:</label>
                            </td>
                            <td className="px-6 py-4">
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={isAllDay} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </td>
                        </tr>

                        {/* All Day Toggle */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label>All Day Event:</label>
                            </td>
                            <td className="px-6 py-4">
                                <input type="checkbox" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} className="mt-1" />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="text-center mt-4">
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
                        disabled={!title && !selectedEventId} // Disable button if no title and not editing
                    >
                        {getButtonText()}
                    </button>
                </div>
            </form>
        </div>
    );
}

