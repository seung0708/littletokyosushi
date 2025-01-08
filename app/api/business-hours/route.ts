import {createClient} from '@/lib/supabase/server';
import { type BusinessHoursResponse, } from '@/types/businessHours';
import { addDays, format } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET() {

    const supabase = await createClient();
    try {
        const { data: regularHours, error: regularHoursError } = await supabase
            .from('business_hours')
            .select('*')
        
        console.log(regularHours, regularHoursError);
        if (regularHoursError) throw regularHoursError;

        const now = new Date();
        const { data: specialSchedules, error: specialSchedulesError } = await supabase
            .from('special_schedules')
            .select('*')
            .gte('start_date', format(now, 'MM-dd-yyyy'))
            .lte('end_date', format(addDays(now, 30), 'MM-dd-yyyy'));

        if (specialSchedulesError) throw specialSchedulesError;

        return NextResponse.json({
            regularHours
        });

    } catch (error) {
        console.error('Error fetching business hours:', error);
        return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 });
        
    }

}
