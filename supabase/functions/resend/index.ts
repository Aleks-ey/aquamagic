// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Deno provides these standard library functions:
// Deno.env for accessing environment variables
// fetch for making HTTP requests

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { Database } from "./types.ts";

console.log("Hello from `resend` function!");

type Registrant = Database["public"]["Tables"]["registrants"]["Row"];
type EmergencyContacts = Database["public"]["Tables"]["emergency_contacts"]["Row"];
type MedicalInformation = Database["public"]["Tables"]["medical_information"]["Row"];
type Schedule = Database["public"]["Tables"]["schedules"]["Row"];

interface WebhookPayload {
  type: "INSERT" | "UPDATE";
  table: string;
  record: null | Registrant;
  schema: "public";
  old_record: null | Registrant;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchData(table: string, registrantId: string) {
    let { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('registrant_id', registrantId);

    if (error) throw error;
    return data;
}

function createEmailBody(registrant: Registrant, medicalInfo: MedicalInformation[], emergencyContacts: EmergencyContacts[], schedule: Schedule[]) {
    let emailBody = `
        Registrant Details:
        <br /><b>Name:</b> ${registrant.first_name} ${registrant.last_name}
        <br /><b>Date Of Birth:</b> ${registrant.date_of_birth}
        <br /><p><b>Email:</b> ${registrant.email ? registrant.email : 'Not provided'}</p>
        <br /><p><b>Phone Number:</b> ${registrant.phone ? registrant.phone : 'Not provided'}</p>
        <br /><p><b>Home Address:</b> ${registrant.home_address}</p>

        <h3>Medical Information:</h3>
        ${medicalInfo.map(info => `
            <p><b>Allergy:</b> ${info.allergy ?? 'Not provided'}</p>
            <p><b>Behavioral Problems:</b> ${info.behavioral_problems ?? 'Not provided'}</p>
            <p><b>Cardiovascular Diseases:</b> ${info.cardiovascular_diseases ?? 'Not provided'}</p>
            <p><b>Conditions After Injury/Surgery:</b> ${info.conditions_after_injury_surgery ?? 'Not provided'}</p>
            <p><b>Congenital Malformations:</b> ${info.congenital_malformations ?? 'Not provided'}</p>
            <p><b>Depression/Anxiety:</b> ${info.depression_anxiety ?? 'Not provided'}</p>
            <p><b>Disability:</b> ${info.disability ?? 'Not provided'}</p>
            <p><b>Epilepsy:</b> ${info.epilepsy ?? 'Not provided'}</p>
            <p><b>Genetic Disorders:</b> ${info.genetic_disorders ?? 'Not provided'}</p>
            <p><b>Main Health Complaints:</b> ${info.main_health_complaints ?? 'Not provided'}</p>
            <p><b>Medication:</b> ${info.medication ?? 'Not provided'}</p>
            <p><b>Mental Problems:</b> ${info.mental_problems ?? 'Not provided'}</p>
            <p><b>Observations (13-16 years):</b> ${info.observations_13_16 ?? 'Not provided'}</p>
            <p><b>Observations (17 and up):</b> ${info.observations_17_up ?? 'Not provided'}</p>
            <p><b>Observations (2-3 years):</b> ${info.observations_2_3 ?? 'Not provided'}</p>
            <p><b>Observations (4-7 years):</b> ${info.observations_4_7 ?? 'Not provided'}</p>
            <p><b>Observations (8-12 years):</b> ${info.observations_8_12 ?? 'Not provided'}</p>
            <p><b>Observations (Birth-1 year):</b> ${info.observations_birth_1 ?? 'Not provided'}</p>
            <p><b>Other Medical Conditions:</b> ${info.other_medical_conditions ?? 'Not provided'}</p>
            <p><b>Surgery:</b> ${info.surgery ?? 'Not provided'}</p>
            <p><b>Trauma:</b> ${info.trauma ?? 'Not provided'}</p>
            `).join('')}

        <h3>Emergency Contacts:</h3>
        ${emergencyContacts.map(contact => `
            <p><b>Name:</b> ${contact.first_name} ${contact.last_name}</p>
            <p><b>Email:</b> ${contact.email}</p>
            <p><b>Phone Number:</b> ${contact.phone}</p>
            <p><b>Relationship:</b> ${contact.relation}</p>
            `).join('')}
        

        <h3>Schedule:</h3>
        ${schedule.map(schedule => `
            <p><b>Monday:</b> ${schedule.monday_availability}</p>
            <p><b>Wednesday:</b> ${schedule.wednesday_availability}</p>
            <p><b>Thursday:</b> ${schedule.thursday_availability}</p>
            <p><b>Friday:</b> ${schedule.friday_availability}</p>
            <p><b>Saturday:</b> ${schedule.saturday_availability}</p>
            <p><b>Sunday:</b> ${schedule.sunday_availability}</p>
            `).join('')}
    `;

    return emailBody;
}

serve(async (req) => {
    const payload: WebhookPayload = await req.json();
    const newRegistrant = payload.record as Registrant;

    // Fetch related data
    const medicalInfo = await fetchData('medical_information', newRegistrant.registrant_id);
    const emergencyContacts = await fetchData('emergency_contacts', newRegistrant.registrant_id);
    const schedule = await fetchData('schedules', newRegistrant.registrant_id);

    // Create email body with all details
    const emailBody = createEmailBody(newRegistrant, medicalInfo, emergencyContacts, schedule);

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        },
        body: JSON.stringify({
            from: "aquamagic <team@bure-aqua.com>",
            to: "akhukhua@yahoo.com",
            subject: payload.old_record ? "Registrant has been updated" : "A new registrant has been added",
            html: emailBody,
        }),
    });

    const data = await res.json();
    console.log({ data });

    return new Response("ok");
});


  
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resend' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'
*/
