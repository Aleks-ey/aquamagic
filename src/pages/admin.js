import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import AddEvent from '@/components/addEvent';
import DeleteEvent from '@/components/deleteEvent';

export default function Admin() {

    return (
        <div className='admin_container'>
            <AddEvent />
            <DeleteEvent />
        </div>
    );
}
