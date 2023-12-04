// pages/admin.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import DatePicker from "react-multi-date-picker";

export default function Admin() {
    // ------------------- add event section -------------------
    const [addDate, setAddDate] = useState('');
    const [addTitle, setAddTitle] = useState('');
    const [addDescription, setAddDescription] = useState('');
    const [addLocation, setAddLocation] = useState('');
    const [addCategory, setAddCategory] = useState('');
    const [addIsAllDay, setAddIsAllDay] = useState(false);
    const [addStartTime, setAddStartTime] = useState('');
    const [addEndTime, setAddEndTime] = useState('');

    // add event
    const handleAddEvent = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('calendar')
            .insert([{
                date: addDate,
                title: addTitle,
                description: addDescription,
                location: addLocation,
                category: addCategory,
                is_all_day: addIsAllDay,
                start_time: addStartTime,
                end_time: addEndTime
            }]);

        if (error) {
            console.error("Error inserting event:", error);
            // Handle the error in a user-friendly way
        } else {
            // Clear the input fields after successful insert
            setAddDate('');
            setAddTitle('');
            setAddDescription('');
            setAddLocation('');
            setAddCategory('');
            setAddIsAllDay(false);
            setAddStartTime('');
            setAddEndTime('');
        }
    }
    // ------------------- ------------------- -------------------
    // ------------------- edit event section -------------------
    // State variables
    const [editDate, setEditDate] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editIsAllDay, setEditIsAllDay] = useState(false);
    const [editStartTime, setEditStartTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // const [events, setEvents] = useState([]);
    // const [editFormData, setEditFormData] = useState({ date: '', title: '', description: '', location: '', category: '', is_all_day: false, start_time: '', end_time: '' });
    const [eventsByDate, setEventsByDate] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');

    // Fetch events from the database
    useEffect(() => {
        const fetchEvents = async () => {
            if (editDate) {
                const { data, error } = await supabase
                    .from('calendar')
                    .select('*')
                    .eq('date', editDate);

                if (error) {
                    console.error("Error fetching events:", error);
                } else {
                    setEventsByDate(data);
                }
            }
        };

        fetchEvents();
    }, [editDate]);

    // When the title input is focused or changed, show the suggestions
    const handleTitleChange = (e) => {
        setEditTitle(e.target.value);
        setShowSuggestions(true);
    };

    // When a suggestion is clicked, set the title and hide suggestions
    const handleSuggestionClick = (suggestedTitle) => {
        setEditTitle(suggestedTitle);
        setShowSuggestions(false);

        const selectedEvent = eventsByDate.find(event => event.title === suggestedTitle);
        if (selectedEvent) {
            setSelectedEventId(selectedEvent.id);
            setEditDescription(selectedEvent.description);
            setEditLocation(selectedEvent.location);
            setEditCategory(selectedEvent.category);
            setEditIsAllDay(selectedEvent.is_all_day);
            setEditStartTime(selectedEvent.start_time);
            setEditEndTime(selectedEvent.end_time);
        }
    };

    // Handle title (event) selection
    // const handleEventSelect = (e) => {
    //     const eventId = e.target.value;
    //     setSelectedEventId(eventId);
    //     const selectedEvent = eventsByDate.find(event => event.id.toString() === eventId);
    //     if (selectedEvent) {
    //         setEditTitle(selectedEvent.title);
    //         setEditDescription(selectedEvent.description);
    //         setEditLocation(selectedEvent.location);
    //         setEditCategory(selectedEvent.category);
    //         setEditIsAllDay(selectedEvent.is_all_day);
    //         setEditStartTime(selectedEvent.start_time);
    //         setEditEndTime(selectedEvent.end_time);
    //     }
    // };

    // Handle form change
    // const handleFormChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    // };

    // edit event
    const handleEditEvent = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('calendar')
            .update([{
                title: editTitle,
                description: editDescription,
                location: editLocation,
                category: editCategory,
                is_all_day: editIsAllDay,
                start_time: editStartTime,
                end_time: editEndTime
            }])
            .match({ id: selectedEventId });

        if (error) {
            console.error("Error updating event:", error);
        } else {
            // Clear form and refresh events
            setEditFormData({ date: '', title: '', description: '', location: '', category: '', is_all_day: false, start_time: '', end_time: '' });
            setEvents(); // Refetch events to update the list
        }
    };
    // ------------------- ------------------- -------------------
    // ------------------- add multiple schedule events -------------------
    const [multiDate, setMultiDate] = useState([]);
    const [multiDateTitle, setMultiDateTitle] = useState('');
    const [multiDateCoach, setMultiDateCoach] = useState('');
    const [multiDateDescription, setMultiDateDescription] = useState('');
    const [multiDateLocation, setMultiDateLocation] = useState('');
    const [multiStartTime, setMultiStartTime] = useState('');
    const [multiEndTime, setMultiEndTime] = useState('');

    const handleAddMultiDateEvent = async (e) => {
        e.preventDefault();
    
        for (let date of multiDate) {
            const { error } = await supabase
                .from('calendar')
                .insert([{
                    date: date.format("YYYY-MM-DD"), // format date as needed
                    title: multiDateTitle,
                    coach: multiDateCoach,
                    description: multiDateDescription,
                    location: multiDateLocation,
                    category: "schedule",
                    is_all_day: false,
                    start_time: multiStartTime,
                    end_time: multiEndTime,
                    // ...other fields
                }]);
    
            if (error) {
                console.error("Error inserting multi-date event:", error);
                break; // stop the loop if there's an error
            }
        }
    
        // Clear form fields and state after successful insert
        setMultiDate([]);
        setMultiDateTitle('');
        setMultiDateDescription('');
        setMultiDateCoach('');
        setMultiDateLocation('');
        setMultiStartTime('');
        setMultiEndTime('');
        // Reset other form fields
    };    
    // ------------------- ------------------- -------------------    

    return (
        <div className='admin_container flex flex-col mt-28 items-center justify-center'>
            <div className='flex flex-col md:flex-row gap-2'>
                {/* add event */}
                <div>
                    <h1 className='text-2xl'>Add Single Event</h1>
                    <form onSubmit={handleAddEvent} className='my-12'>
                        <table className='table-fixed border-collapse'>
                            <tbody>
                                <tr>
                                    <td className='border px-4 py-2'>Date:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} required />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Title:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="text" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} required className='border-2 border-gray-400 w-full' />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Description:</td>
                                    <td className='border px-4 py-2'>
                                        <textarea value={addDescription} onChange={(e) => setAddDescription(e.target.value)} required className='border-2 border-gray-400 w-full' />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Location:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="text" value={addLocation} onChange={(e) => setAddLocation(e.target.value)} required className='border-2 border-gray-400 w-full' />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Category:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="text" value={addCategory} onChange={(e) => setAddCategory(e.target.value)} required className='border-2 border-gray-400 w-full' />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>All Day:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="checkbox" checked={addIsAllDay} onChange={(e) => setAddIsAllDay(e.target.checked)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Start Time:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="time" value={addStartTime} onChange={(e) => setAddStartTime(e.target.value)} required />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>End Time:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="time" value={addEndTime} onChange={(e) => setAddEndTime(e.target.value)} required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-center mt-4'>
                            <button type="submit" className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none'>Add Event</button>
                        </div>
                    </form>
                </div>
                {/* edit event */}
                <div>
                    <h1 className='text-2xl'>Edit Single Event</h1>
                    <form onSubmit={handleEditEvent} className='my-12'>
                        <table className='table-fixed border-collapse'>
                            <tbody>
                                <tr>
                                    <td className='border px-4 py-2'>Date:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} required />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Title:</td>
                                    <td className='border px-4 py-2'>
                                        <input 
                                            type="text" 
                                            value={editTitle} 
                                            onChange={handleTitleChange} 
                                            onFocus={() => setShowSuggestions(true)}
                                            className='border-2 border-gray-400 w-full'
                                            required 
                                        />
                                        {showSuggestions && (
                                            <div className="suggestions">
                                                {eventsByDate.map((event, index) => (
                                                    <div key={index} onClick={() => handleSuggestionClick(event.title)}>
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Description:</td>
                                    <td className='border px-4 py-2'>
                                        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required className='border-2 border-gray-400 w-full' />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Location:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required className='border-2 border-gray-400 w-full' />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Category:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} required className='border-2 border-gray-400 w-full' />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>All Day:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="checkbox" checked={editIsAllDay} onChange={(e) => setEditIsAllDay(e.target.checked)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>Start Time:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} required />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border px-4 py-2'>End Time:</td>
                                    <td className='border px-4 py-2'>
                                        <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-center mt-4'>
                            <button type="submit" className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none'>Edit Event</button>
                        </div>
                    </form>
                </div>
            </div>
            <div>
                {/* add multiple schedules events */}
                <div>
                    <h1 className='text-2xl'>Add Schedule Days</h1>
                    <form onSubmit={handleAddMultiDateEvent} className='my-12'>
                    <table className='table-fixed border-collapse'>
                        <tbody>
                            {/* Date Picker Field */}
                            <tr>
                                <td className='border px-4 py-2'>Select Dates:</td>
                                <td className='border px-4 py-2'>
                                    <DatePicker
                                        value={multiDate}
                                        onChange={setMultiDate}
                                        multiple
                                    />
                                </td>
                            </tr>

                            {/* Title Field */}
                            <tr>
                                <td className='border px-4 py-2'>Title:</td>
                                <td className='border px-4 py-2'>
                                    <input 
                                        type="text" 
                                        value={multiDateTitle} 
                                        onChange={(e) => setMultiDateTitle(e.target.value)} 
                                        required 
                                        className='border-2 border-gray-400 w-full'
                                    />
                                </td>
                            </tr>

                            {/* Coach Field */}
                            <tr>
                                <td className='border px-4 py-2'>Coach:</td>
                                <td className='border px-4 py-2'>
                                    <input 
                                        type="text" 
                                        value={multiDateCoach} 
                                        onChange={(e) => setMultiDateCoach(e.target.value)} 
                                        required 
                                        className='border-2 border-gray-400 w-full'
                                    />
                                </td>
                            </tr>

                            {/* Description Field */}
                            <tr>
                                <td className='border px-4 py-2'>Description:</td>
                                <td className='border px-4 py-2'>
                                    <textarea 
                                        value={multiDateDescription} 
                                        onChange={(e) => setMultiDateDescription(e.target.value)}
                                        className='border-2 border-gray-400 w-full'
                                    />
                                </td>
                            </tr>

                            {/* Location Field */}
                            <tr>
                                <td className='border px-4 py-2'>Location:</td>
                                <td className='border px-4 py-2'>
                                    <input 
                                        type="text" 
                                        value={multiDateLocation} 
                                        onChange={(e) => setMultiDateLocation(e.target.value)}
                                        className='border-2 border-gray-400 w-full'
                                    />
                                </td>
                            </tr>

                            {/* Start Time Field */}
                            <tr>
                                <td className='border px-4 py-2'>Start Time:</td>
                                <td className='border px-4 py-2'>
                                    <input 
                                        type="time" 
                                        value={multiStartTime} 
                                        onChange={(e) => setMultiStartTime(e.target.value)} 
                                        required 
                                    />
                                </td>
                            </tr>

                            {/* End Time Field */}
                            <tr>
                                <td className='border px-4 py-2'>End Time:</td>
                                <td className='border px-4 py-2'>
                                    <input 
                                        type="time" 
                                        value={multiEndTime} 
                                        onChange={(e) => setMultiEndTime(e.target.value)} 
                                        required 
                                    />
                                </td>
                            </tr>

                            {/* Add other necessary fields as per your requirements */}
                        </tbody>
                    </table>

                    <div className='text-center mt-4'>
                        <button type="submit" className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 focus:outline-none'>Add Schedule Days</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}
