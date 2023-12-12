import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Registration() {
    // State for form inputs
    const [formData, setFormData] = useState({
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
        guardians: [
            { lastName: '', firstName: '', relation: '', phone: '', email: '' },
            { lastName: '', firstName: '', relation: '', phone: '', email: '' },
            { lastName: '', firstName: '', relation: '', phone: '', email: '' }
        ],

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
        observations_birth_1Checked: false,
        observations_birth_1Unchecked: false,
        observations_2_3Checked: false,
        observations_2_3Unchecked: false,
        observations_4_7Checked: false,
        observations_4_7Unchecked: false,
        observations_8_12Checked: false,
        observations_8_12Unchecked: false,
        observations_13_16Checked: false,
        observations_13_16Unchecked: false,
        observations_17_upChecked: false,
        observations_17_upUnchecked: false,

        // Schedule fields
        mondayAvailability: '',
        tuesdayAvailability: '',
        wednesdayAvailability: '',
        thursdayAvailability: '',
        fridayAvailability: '',
        saturdayAvailability: '',
        sundayAvailability: ''
    });

    // Handle form input changes
    const handleChange = (e, section, index) => {
        if (section) {
            const updatedGuardians = [...formData.guardians];
            updatedGuardians[index] = { ...updatedGuardians[index], [e.target.name]: e.target.value };
            setFormData({ ...formData, guardians: updatedGuardians });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
    
        try {
            // Insert into 'registrants' table
            const { error: registrantError } = await supabase
                .from('registrants')
                .insert([{ 
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    date_of_birth: formData.dateOfBirth,
                    phone: formData.phone,
                    email: formData.email,
                    home_address: formData.homeAddress
                }]);
    
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

            console.log('registrantData:', registrantData);
            const registrantId = registrantData[0].registrant_id;
    
            // Insert into 'guardians' table
            let guardianIds = [];
            for (const guardian of formData.guardians) {
                const {data: guardianResponseData, error: guardianError } = await supabase
                    .from('emergency_contacts')
                    .insert([{
                        registrant_id: registrantId,
                        first_name: guardian.firstName,
                        last_name: guardian.lastName,
                        phone: guardian.phone,
                        email: guardian.email,
                        relation: guardian.relation
                    }]);
                if (guardianError) throw guardianError;
                guardianIds.push(guardianResponseData.contact_id);
            }
    
            // Insert into 'medical_information' table
            const medicalData = {
                registrant_id: registrantId,
                main_health_complaints: formData.main_health_complaintsChecked ? formData.main_health_complaints : null,
                disability: formData.disabilityChecked ? formData.disability : null,
                congenital_malformations: formData.congenital_malformationsChecked ? formData.congenital_malformations : null,
                genetic_disorders: formData.genetic_disordersChecked ? formData.genetic_disorders : null,
                epilepsy: formData.epilepsyChecked ? formData.epilepsy : null,
                cardiovascular_diseases: formData.cardiovascular_diseasesChecked ? formData.cardiovascular_diseases : null,
                mental_problems: formData.mental_problemsChecked ? formData.mental_problems : null,
                conditions_after_injury_surgery: formData.conditions_after_injury_surgeryChecked ? formData.conditions_after_injury_surgery : null,
                depression_anxiety: formData.depression_anxietyChecked ? formData.depression_anxiety : null,
                behavioral_problems: formData.behavioral_problemsChecked ? formData.behavioral_problems : null,
                medication: formData.medicationChecked ? formData.medication : null,
                surgery: formData.surgeryChecked ? formData.surgery : null,
                trauma: formData.traumaChecked ? formData.trauma : null,
                other_medical_conditions: formData.other_medical_conditionsChecked ? formData.other_medical_conditions : null,
                allergy: formData.allergyChecked ? formData.allergy : null,
                observations_birth_1: formData.observations_birth_1Checked ? formData.observations_birth_1 : null,
                observations_2_3: formData.observations_2_3Checked ? formData.observations_2_3 : null,
                observations_4_7: formData.observations_4_7Checked ? formData.observations_4_7 : null,
                observations_8_12: formData.observations_8_12Checked ? formData.observations_8_12 : null,
                observations_13_16: formData.observations_13_16Checked ? formData.observations_13_16 : null,
                observations_17_up: formData.observations_17_upChecked ? formData.observations_17_up : null,
            };            
            const {medicalResponeData, error: medicalError } = await supabase
                .from('medical_information')
                .insert([medicalData]);
            if (medicalError) throw medicalError;

            const medicalInfoId = medicalDataResponse.medical_info_id;
    
            // Insert into 'schedules' table
            const scheduleData = {
                registrant_id: registrantId,
                monday_availability: formData.mondayAvailability,
                tuesday_availability: formData.tuesdayAvailability,
                wednesday_availability: formData.wednesdayAvailability,
                thursday_availability: formData.thursdayAvailability,
                friday_availability: formData.fridayAvailability,
                saturday_availability: formData.saturdayAvailability,
                sunday_availability: formData.sundayAvailability,
            };
            const {scheduleResponseData, error: scheduleError } = await supabase
                .from('schedules')
                .insert([scheduleData]);
            if (scheduleError) throw scheduleError;

            const scheduleId = scheduleResponseData.schedule_id;

            // Insert guradianIds, medicalInfoId, and scheduleId into 'registrants' table
            // const {registrantResponseData, error: registrantError2 } = await supabase
            //     .from('registrants')
            //     .update({
            //         emergency_contact_1_id: guardianIds[0],
            //         emergency_contact_2_id: guardianIds[1],
            //         emergency_contact_3_id: guardianIds[2],
            //         medical_info_id: medicalInfoId,
            //         schedule_id: scheduleId
            //     })
            //     .eq('registrant_id', registrantId);
            // if (registrantError2) throw registrantError2;
    
            // Form submission successful
            console.log('Form submitted successfully');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
    
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
                                        value={guardian[`firstName${index + 1}`]}
                                        onChange={(e) => handleChange(e, index)} 
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
                                        value={guardian[`lastName${index + 1}`]}
                                        onChange={(e) => handleChange(e, index)} 
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
                                        value={guardian[`phone${index + 1}`]}
                                        onChange={(e) => handleChange(e, index)} 
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
                                        value={guardian[`email${index + 1}`]} 
                                        onChange={(e) => handleChange(e, index)} 
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
                                        value={guardian[`relation${index + 1}`]}
                                        onChange={(e) => handleChange(e, index)} 
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

                <h4 className='mt-10 text-left text-large font-semibold'>Observations from specialists:</h4>
                <hr className='w-full border-gray-400 mb-3' />
                <table className="medical-info">
                    {[
                        'observations_birth_1', 'observations_2_3',
                        'observations_4_7', 'observations_8_12',
                        'observations_13_16', 'observations_17_up'
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
        </div>
    );
}