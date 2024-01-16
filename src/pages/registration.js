import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { insertRegistrant, insertEmergencyContacts, insertMedicalInfo, insertSchedule } from '../utils/dbInserts';
import { updateRegistrant, updateEmergencyContacts, updateMedicalInfo, updateSchedule } from '../utils/dbUpdates';

export default function Registration() {
    
    const initialFormData = {
        // Registrant fields
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        homeAddress: '',
        city: '',
        zipCode: '',
        
        // Guardian fields - Up to 3 guardians
        guardians: Array(3).fill().map(() => ({
            lastName: '',
            firstName: '',
            relation: '',
            phone: '',
            email: ''
        })),

        // Medical information fields
        mainHealthComplaints: '',
        disability: '',
        congenitalMalformations: '',
        geneticDisorders: '',
        epilepsy: '',
        cardiovascularDiseases: '',
        mentalProblems: '',
        conditionsAfterInjurySurgery: '',
        depressionAnxiety: '',
        behavioralProblems: '',
        medication: '',
        surgery: '',
        trauma: '',
        otherMedicalConditions: '',
        allergy: '',
        observationsBirth1: '',
        observations23: '',
        observations47: '',
        observations812: '',
        observations1316: '',
        observations17Up: '',
        main_health_complaintsChecked: false,
        main_health_complaintsUnchecked: false,
        disabilityChecked: false,
        disabilityUnchecked: false,
        congenital_malformationsChecked: false,
        congenital_malformationsUnchecked: false,
        genetic_disordersChecked: false,
        genetic_disordersUnchecked: false,
        epilepsyChecked: false,
        epilepsyUnchecked: false,
        cardiovascular_diseasesChecked: false,
        cardiovascular_diseasesUnchecked: false,
        mental_problemsChecked: false,
        mental_problemsUnchecked: false,
        conditions_after_injury_or_surgeryChecked: false,
        conditions_after_injury_or_surgeryUnchecked: false,
        depression_anxietyChecked: false,
        depression_anxietyUnchecked: false,
        behavioral_problemsChecked: false,
        behavioral_problemsUnchecked: false,
        medicationChecked: false,
        medicationUnchecked: false,
        surgeryChecked: false,
        surgeryUnchecked: false,
        traumaChecked: false,
        traumaUnchecked: false,
        other_medical_conditionsChecked: false,
        other_medical_conditionsUnchecked: false,
        observations_from_birth_to_1_YOChecked: false,
        observations_from_birth_to_1_YOUnchecked: false,
        observations_from_2_to_3_YOChecked: false,
        observations_from_2_to_3_YOUnchecked: false,
        observations_from_4_to_7_YOChecked: false,
        observations_from_4_to_7_YOUnchecked: false,
        observations_from_8_to_12_YOChecked: false,
        observations_from_8_to_12_YOUnchecked: false,
        observations_from_13_to_16_YOChecked: false,
        observations_from_13_to_16_YOUnchecked: false,
        observations_17_and_upChecked: false,
        observations_17_and_upUnchecked: false,

        // Schedule fields
        mondayAvailability: '',
        tuesdayAvailability: '',
        wednesdayAvailability: '',
        thursdayAvailability: '',
        fridayAvailability: '',
        saturdayAvailability: '',
        sundayAvailability: ''
    };
    const [formData, setFormData] = useState(initialFormData);

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [showExistingRegistrantPopup, setShowExistingRegistrantPopup] = useState(false);
    const [existingRegistrant, setExistingRegistrant] = useState(null);

    // Handle form input changes
    const handleChange = (e, section) => {
        const { name, value } = e.target;

        if (section === 'guardians') {
            // Extract the base field name and the guardian index from the dynamic name
            const baseFieldName = name.replace(/\d+$/, ''); // removes the index number from the end
            const guardianIndex = parseInt(name.match(/\d+$/), 10) - 1; // extracts the index number
    
            // Update the specific guardian object
            const updatedGuardians = [...formData.guardians];
            updatedGuardians[guardianIndex] = { ...updatedGuardians[guardianIndex], [baseFieldName]: value };
            setFormData({ ...formData, guardians: updatedGuardians });
        } else {
            // Handle other form fields outside guardians section
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Check if registrant already exists in 'registrants' table
        const { data: existingRegistrants, error: existingError } = await supabase
            .from('registrants')
            .select('*')
            .eq('first_name', formData.firstName)
            .eq('last_name', formData.lastName);

        if (existingError) throw existingError;

        if (existingRegistrants.length > 0) {
            setExistingRegistrant(existingRegistrants[0]); // use the first result
            setShowExistingRegistrantPopup(true);
            return;
        }
        else {
            handleInsertRegistrant();
        }
    }

    // Popup about existing registrant, with option to update
    function ExistingRegistrantPopup({ registrant, onClose, onUpdate }) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50 z-10">
                <div className="bg-white p-5 rounded-md text-center">
                    <p>Registrant already exists in the database.</p>
                    <p>Would you like to update the registrant's information?</p>
                    <div className="flex justify-around">
                        <button onClick={onUpdate} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Update</button>
                        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
                    </div>
                </div>
            </div>
        );
    }

    async function handleUpdateExistingRegistrant() {
        try {
            // Update registrant data
            const registrantError = await updateRegistrant(formData, existingRegistrant.registrant_id);
            if (registrantError) throw registrantError;
    
            // Update emergency contacts
            const contactErrors = await updateEmergencyContacts(formData, existingRegistrant.registrant_id);
            if (contactErrors.length > 0) throw contactErrors;
    
            // Update medical information
            const medicalError = await updateMedicalInfo(formData, existingRegistrant.registrant_id);
            if (medicalError) throw medicalError;
    
            // Update schedule
            const scheduleError = await updateSchedule(formData, existingRegistrant.registrant_id);
            if (scheduleError) throw scheduleError;

            setSubmissionStatus('success');
            setShowExistingRegistrantPopup(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmissionStatus('error');
        }
    };

    async function handleInsertRegistrant() {
        try {
            // Insert registrant data
            const { data, error: registrantError } = await insertRegistrant(formData);
            if (registrantError) throw registrantError;

            // Get registrant_id from 'registrants' table
            const { data: registrantData } = await supabase
                .from('registrants')
                .select('registrant_id')
                .eq('first_name', formData.firstName)
                .eq('last_name', formData.lastName)
                .eq('date_of_birth', formData.dateOfBirth)
                .eq('phone', formData.phone)
                .eq('email', formData.email)
                .eq('home_address', formData.homeAddress);

            const registrantId = registrantData[0].registrant_id;
    
            // Insert emergency contacts
            const contactErrors = await insertEmergencyContacts(formData, registrantId);
            if (contactErrors.length > 0) throw contactErrors;
    
            // Insert medical information
            const medicalError = await insertMedicalInfo(formData, registrantId);
            if (medicalError) throw medicalError;
    
            // Insert schedule
            const scheduleError = await insertSchedule(formData, registrantId);
            if (scheduleError) throw scheduleError;
    
            setSubmissionStatus('success');
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmissionStatus('error');
        }
    }

    // Confirmation popup component
    function ConfirmationPopup({ status, onClose }) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50 z-10">
                <div className="bg-white p-5 rounded-md text-center">
                    {status === 'success' && <p>Form submitted successfully!<br/>Please wait to be contacted by our team.</p>}
                    {status === 'error' && <p>Error submitting form. Please try again.</p>}
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
                </div>
            </div>
        );
    }
    
    // Close confirmation popup
    const handleClose = () => {
        setSubmissionStatus(null);
        setShowExistingRegistrantPopup(false);

        // Reset form data
        setFormData(initialFormData);

        window.scrollTo(0, 0); // Scroll to the top of the page
    };
    
    return (
        <div className='mt-32 mb-10 flex flex-col justify-center text-center'>
            <h1 className='text-4xl font-bold'>Registration Form</h1>
            <form onSubmit={handleSubmit} className='mt-10 md:mt-20 flex flex-col justify-center w-full px-5 mx-auto md:w-1/2 md:px-0'>
                {/* Registrant fields */}
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <h3 className='mb-10 text-2xl'>Registrant</h3>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='text-left w-1/4 pr-4'>
                                First Name:
                            </td>
                            <td>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm' 
                                    type="text" 
                                    name="firstName" 
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                    placeholder="First Name"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Last Name:
                            </td>
                            <td>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm' 
                                    type="text" 
                                    name="lastName" 
                                    value={formData.lastName} 
                                    onChange={handleChange} 
                                    placeholder="Last Name" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Date of Birth:
                            </td>
                            <td>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm' 
                                    type="date" 
                                    name="dateOfBirth" 
                                    value={formData.dateOfBirth} 
                                    onChange={handleChange} 
                                    placeholder="Date of Birth" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Phone:
                            </td>
                            <td>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm' 
                                    type="text" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    placeholder="Phone" 
                                />
                            </td>     
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Email:
                            </td>
                            <td>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm' 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="Email" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Home Address:
                            </td>
                            <td>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm' 
                                    type="text" 
                                    name="homeAddress" 
                                    value={formData.homeAddress} 
                                    onChange={handleChange} 
                                    placeholder="Home Address" 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Guardian fields - Rendered for up to 3 guardians */}
                <h3 className='mt-20 font-bold text-2xl'>Guardians</h3>
                {formData.guardians.map((guardian, index) => (
                    <table key={index}>
                        <thead>
                            <tr>
                                <th colSpan="2">
                                <h4 className='mt-10 text-left text-large font-semibold'>Guardian {index + 1}</h4>
                                <hr className='w-full border-gray-400 mb-3' />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='text-left w-1/4 pr-4'>
                                    First Name:
                                </td>
                                <td>
                                    <input 
                                        className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                        type="text" 
                                        name={`firstName${index + 1}`} 
                                        value={guardian.firstName}
                                        onChange={(e) => handleChange(e, 'guardians')} 
                                        placeholder="First Name" 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className='text-left pr-4'>
                                    Last Name:
                                </td>
                                <td>
                                    <input 
                                        className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                        type="text" 
                                        name={`lastName${index + 1}`}
                                        value={guardian.lastName}
                                        onChange={(e) => handleChange(e, 'guardians')} 
                                        placeholder="Last Name" 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className='text-left pr-4'>
                                    Phone:
                                </td>
                                <td>
                                    <input 
                                        className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                        type="text" 
                                        name={`phone${index + 1}`}
                                        value={guardian.phone}
                                        onChange={(e) => handleChange(e, 'guardians')} 
                                        placeholder="Phone" 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className='text-left pr-4'>
                                    Email:
                                </td>
                                <td>
                                    <input 
                                        className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                        type="email" 
                                        name={`email${index + 1}`}
                                        value={guardian.email} 
                                        onChange={(e) => handleChange(e, 'guardians')} 
                                        placeholder="Email" 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className='text-left pr-4'>
                                    Relation:
                                </td>
                                <td>
                                    <input 
                                        className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                        type="text" 
                                        name={`relation${index + 1}`}
                                        value={guardian.relation}
                                        onChange={(e) => handleChange(e, 'guardians')} 
                                        placeholder="Relation" 
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ))}

                {/* Medical information fields */}
                <h3 className='mt-20 font-bold text-2xl'>Medical Information</h3>

                <h4 className='mt-10 text-left text-large font-semibold'>Main Health Complaints:</h4>
                <hr className='w-full border-gray-400 mb-3' />
                <textarea
                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                    name="mainHealthComplaints"
                    value={formData.mainHealthComplaints}
                    onChange={handleChange}
                    placeholder="Main Health Complaints (if none you may leave blank)"
                />

                <h4 className='mt-10 text-left text-large font-semibold'>Does your child/you have/had:</h4>
                <hr className='w-full border-gray-400 mb-3' />
                <table className="medical-info">
                    {[
                        'disability', 'congenital_malformations', 
                        'genetic_disorders', 'epilepsy', 'cardiovascular_diseases', 
                        'mental_problems', 'conditions_after_injury_or_surgery', 
                        'depression/anxiety', 'behavioral_problems', 'medication', 
                        'surgery', 'trauma', 'other_medical_conditions',
                    ].map((field) => (
                        <tbody key={field} className="field w-full">
                            <tr className='w-full'>
                                <td className='text-left w-1/2'>
                                    -{field.replace(/_/g, ' ')}
                                </td>
                                <td className='text-left pl-4'>
                                    <input
                                        className='' 
                                        type="checkbox" 
                                        checked={formData[field + 'Checked']}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            [field + 'Checked']: e.target.checked,
                                            [field + 'Unchecked']: !e.target.checked 
                                        })}
                                    /> Yes
                                    <input 
                                        className='ml-10'
                                        type="checkbox"
                                        checked={formData[field + 'Unchecked']}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            [field + 'Checked']: !e.target.checked,
                                            [field + 'Unchecked']: e.target.checked 
                                        })}
                                    /> No
                                </td>
                            </tr>
                            <tr className='w-full'>
                                <td className='w-full pb-8' colSpan={2}>
                                    {formData[field + 'Checked'] && (
                                        <input 
                                            className='block text-center p-1 mt-2 w-full border-gray-400 border-2 rounded-sm'
                                            type="text" 
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            placeholder="Details"
                                        />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>

                <h4 className='text-left text-large font-semibold'>Allergy:</h4>
                <hr className='w-full border-gray-400 mb-3' />
                <textarea
                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                    name="allergy"
                    value={formData.allergy}
                    onChange={handleChange}
                    placeholder="Allergies (if no allergies you may leave blank)"
                />

                <h4 className='mt-10 text-left text-large font-semibold'>Health Problems & Observations from specialists:</h4>
                <hr className='w-full border-gray-400 mb-3' />
                <table className="medical-info">
                    {[
                        'observations_from_birth_to_1_YO', 'observations_from_2_to_3_YO',
                        'observations_from_4_to_7_YO', 'observations_from_8_to_12_YO',
                        'observations_from_13_to_16_YO', 'observations_17_and_up'
                    ].map((field) => (
                        <tbody key={field} className="field w-full">
                            <tr className='w-full'>
                                <td className='text-left w-1/2'>
                                    -{field.replace(/_/g, ' ')}
                                </td>
                                <td className='text-left pl-4'>
                                    <input
                                        className='' 
                                        type="checkbox" 
                                        checked={formData[field + 'Checked']}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            [field + 'Checked']: e.target.checked,
                                            [field + 'Unchecked']: !e.target.checked 
                                        })}
                                    /> Yes
                                    <input 
                                        className='ml-10'
                                        type="checkbox"
                                        checked={formData[field + 'Unchecked']}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            [field + 'Checked']: !e.target.checked,
                                            [field + 'Unchecked']: e.target.checked 
                                        })}
                                    /> No
                                </td>
                            </tr>
                            <tr className='w-full'>
                                <td className='w-full pb-8' colSpan={2}>
                                    {formData[field + 'Checked'] && (
                                        <input 
                                            className='block text-center p-1 mt-2 w-full border-gray-400 border-2 rounded-sm'
                                            type="text" 
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            placeholder="Details"
                                        />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>

                {/* Schedule fields */}
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <h3 className='my-10 text-2xl'>Availability</h3>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='text-left w-1/4 pr-4'>
                                Monday:
                            </td>
                            <td className='pb-5'>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                    type="text" 
                                    name="mondayAvailability" 
                                    value={formData.mondayAvailability} 
                                    onChange={handleChange} 
                                    placeholder="Monday Availability" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Tuesday:
                            </td>
                            <td className='pb-5'>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                    type="text" 
                                    name="tuesdayAvailability" 
                                    value={formData.tuesdayAvailability} 
                                    onChange={handleChange} 
                                    placeholder="Tuesday Availability" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Wednesday:
                            </td>
                            <td className='pb-5'>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                    type="text" 
                                    name="wednesdayAvailability" 
                                    value={formData.wednesdayAvailability} 
                                    onChange={handleChange} 
                                    placeholder="Wednesday Availability" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Thursday:
                            </td>
                            <td className='pb-5'>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                    type="text" 
                                    name="thursdayAvailability" 
                                    value={formData.thursdayAvailability} 
                                    onChange={handleChange} 
                                    placeholder="Thursday Availability" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Friday:
                            </td>
                            <td className='pb-5'>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                    type="text" 
                                    name="fridayAvailability" 
                                    value={formData.fridayAvailability} 
                                    onChange={handleChange} 
                                    placeholder="Friday Availability" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Saturday:
                            </td>
                            <td className='pb-5'>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                    type="text" 
                                    name="saturdayAvailability" 
                                    value={formData.saturdayAvailability} 
                                    onChange={handleChange} 
                                    placeholder="Saturday Availability" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='text-left pr-4'>
                                Sunday:
                            </td>
                            <td className='pb-5'>
                                <input 
                                    className='w-full px-2 border-gray-400 border-2 rounded-sm'
                                    type="text" 
                                    name="sundayAvailability" 
                                    value={formData.sundayAvailability} 
                                    onChange={handleChange} 
                                    placeholder="Sunday Availability" 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex justify-center text-center'>
                    <button type="submit" className='w-48 mt-16 p-2 border-pool-water border-2 rounded-md text-pool-water hover:text-white hover:bg-pool-water'>Submit</button>
                </div>
            </form>
            {/* Conditional Rendering of Confirmation Popup */}
            {submissionStatus && <ConfirmationPopup status={submissionStatus} onClose={handleClose} />}
            {showExistingRegistrantPopup && <ExistingRegistrantPopup registrant={existingRegistrant} onClose={handleClose} onUpdate={handleUpdateExistingRegistrant} />}
        </div>
    );
}