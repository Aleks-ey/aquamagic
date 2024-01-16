import { supabase } from './supabaseClient';

// Function to update registrant data
export async function updateRegistrant(formData, registrantId) {
    const { error } = await supabase
        .from('registrants')
        .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            date_of_birth: formData.dateOfBirth,
            phone: formData.phone,
            email: formData.email,
            home_address: formData.homeAddress,
        })
        .eq('registrant_id', registrantId);
    return error;
}

// Function to update emergency contacts
export async function updateEmergencyContacts(formData, registrantId) {
    let errors = [];
    for (const guardian of formData.guardians) {
        if (guardian.firstName || guardian.lastName || guardian.phone || guardian.email || guardian.relation) {
            const { error } = await supabase
                .from('emergency_contacts')
                .update({
                    first_name: guardian.firstName,
                    last_name: guardian.lastName,
                    phone: guardian.phone,
                    email: guardian.email,
                    relation: guardian.relation,
                })
                .eq('registrant_id', registrantId); // Assuming registrant_id is used to link emergency contacts
            if (error) errors.push(error);
        }
    }
    return errors;
}

// Function to update medical information
export async function updateMedicalInfo(formData, registrantId) {
    const { error } = await supabase
        .from('medical_information')
        .update({
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
            observations_birth_1: formData.observations_from_birth_to_1_YOChecked ? formData.observations_from_birth_to_1_YO : null,
            observations_2_3: formData.observations_from_2_to_3_YOChecked ? formData.observations_from_2_to_3_YO : null,
            observations_4_7: formData.observations_from_4_to_7_YOChecked ? formData.observations_from_4_to_7_YO : null,
            observations_8_12: formData.observations_from_8_to_12_YOChecked ? formData.observations_from_8_to_12_YO : null,
            observations_13_16: formData.observations_from_13_to_16_YOChecked ? formData.observations_from_13_to_16_YO : null,
            observations_17_up: formData.observations_17_and_upChecked ? formData.observations_17_and_up : null,
        })
        .eq('registrant_id', registrantId);
    return error;
}

// Function to update schedule
export async function updateSchedule(formData, registrantId) {
    const { error } = await supabase
        .from('schedules')
        .update({
            monday_availability: formData.mondayAvailability,
            tuesday_availability: formData.tuesdayAvailability,
            wednesday_availability: formData.wednesdayAvailability,
            thursday_availability: formData.thursdayAvailability,
            friday_availability: formData.fridayAvailability,
            saturday_availability: formData.saturdayAvailability,
            sunday_availability: formData.sundayAvailability,
        })
        .eq('registrant_id', registrantId);
    return error;
}
