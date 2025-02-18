'use client';
import {useState, useEffect} from "react";
import { type BusinessHoursResponse } from "@/types/businessHours";
import {format, parse, addMinutes } from "date-fns";

export const useBusinessHours = () => {
    const [businessHours, setBusinessHours] = useState<BusinessHoursResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusinessHours = async () => {
            try { 
                const response = await fetch('/api/business-hours');
                if (!response.ok) throw new Error('Failed to fetch business hours');
                const data = await response.json();
                setBusinessHours(data);
            } catch (error) {
                console.error('Error fetching business hours:', error);
                setError('Failed to fetch business hours');
            } finally {
                setIsLoading(false);
            }
        }

        fetchBusinessHours();
    }, []);

    function getAvailablePickupTimes(date: Date): string[] {
        if (!businessHours) return [];

        const dayOfWeek = format(date, 'eeee').toLowerCase();
        const dateStr = format(date, 'MM-dd-yyyy');
        const times: string[] = [];
        const specialSchedule = businessHours.specialSchedules.find(schedule => schedule.date === dateStr);
        if (specialSchedule) {
            if (!specialSchedule.isOpen) return []
            const startTime = parse(specialSchedule.pickupStart!.slice(0, 5), 'HH:mm', date);
            const endTime = parse(specialSchedule.pickupEnd!.slice(0, 5), 'HH:mm', date);
            let currentTime = startTime;

            while (currentTime <= endTime) {
                times.push(format(currentTime, 'HH:mm'));
                currentTime = addMinutes(currentTime, 15);
            }

            return times;
        }

        const regularHours = businessHours.regularHours.find(hours => hours.day === dayOfWeek);

        if (!regularHours?.isOpen) return [];

        let currentTime = parse(regularHours.pickupStart!.slice(0, 5), 'HH:mm', date);
        const endTime = parse(regularHours.pickupEnd!.slice(0, 5), 'HH:mm', date);

        while (currentTime <= endTime) {
            times.push(format(currentTime, 'h:mm aaa'));
            currentTime = addMinutes(currentTime, 15);
        }
        return times;

    }

    return { businessHours, isLoading, error, getAvailablePickupTimes };
}

  