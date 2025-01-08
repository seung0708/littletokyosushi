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

        const transformedRegularHours = regularHours.map(hour => ({
            id: hour.id,
            day: hour.day,
            isOpen: hour.is_open,
            orderingStart: hour.ordering_start,
            orderingEnd: hour.ordering_end,
            pickupStart: hour.pickup_start,
            pickupEnd: hour.pickup_end
        }));

        const now = new Date();
        const { data: specialSchedules, error: specialSchedulesError } = await supabase
            .from('special_schedules')
            .select('*')
            .gte('date', format(now, 'MM-dd-yyyy'))
            .lte('date', format(addDays(now, 30), 'MM-dd-yyyy'));

        if (specialSchedulesError) throw specialSchedulesError;

        const transformedSpecialSchedules = specialSchedules?.map(schedule => ({
            id: schedule.id,
            date: schedule.date,
            scheduleType: schedule.schedule_type,
            isOpen: schedule.is_open,
            orderingStart: schedule.ordering_start,
            orderingEnd: schedule.ordering_end,
            pickupStart: schedule.pickup_start,
            pickupEnd: schedule.pickup_end,
            note: schedule.note
        })) || [];

        return NextResponse.json({
            regularHours: transformedRegularHours,
            specialSchedules: transformedSpecialSchedules
        });

    } catch (error) {
        console.error('Error fetching business hours:', error);
        return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 });
        
    }

}
