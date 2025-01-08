import {z} from "zod";

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type ScheduleType = 'regular' | 'holiday' | 'special';

export interface BusinessHours {
    id: string;
    day: Weekday;
    isOpen: boolean;
    orderingStart: string;
    orderingEnd: string;
    pickupStart: string | null;
    pickupEnd: string | null;
}

export interface BusinessHoursInput {
    id: string; 
    date: string;
    scheduleType: ScheduleType;
    isOpen: boolean;
    orderingStart: string;
    orderingEnd: string;
    pickupStart: string | null;
    pickupEnd: string | null;
    note: string | null;
}

export interface SpecialSchedule {
    id: string;
    date: string;
    scheduleType: ScheduleType;
    isOpen: boolean;
    orderingStart: string;
    orderingEnd: string;
    pickupStart: string | null;
    pickupEnd: string | null;
    note: string | null;
}

export const businessHoursSchema = z.object({
    id: z.string().uuid(),
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    isOpen: z.boolean(),
    orderingStart: z.string(),
    orderingEnd: z.string(),
    pickupStart: z.string().nullable(),
    pickupEnd: z.string().nullable(),
});

export const specialScheduleSchema = z.object({
    id: z.string().uuid(),
    date: z.string(),
    scheduleType: z.enum(['regular', 'holiday', 'special']),
    isOpen: z.boolean(),
    orderingStart: z.string(),
    orderingEnd: z.string(),
    pickupStart: z.string().nullable(),
    pickupEnd: z.string().nullable(),
    note: z.string().nullable(),
});

export interface BusinessHoursResponse {
    regularHours: BusinessHours[];
    specialSchedules: SpecialSchedule[];
}
