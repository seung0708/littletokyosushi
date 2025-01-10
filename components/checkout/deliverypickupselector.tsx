'use client'
import {UseFormReturn} from 'react-hook-form'
import {type CheckoutFormValues} from '@/types/checkout';
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useBusinessHours } from '@/app/hooks/useBusinessHours'
import { format, parse, isAfter } from 'date-fns';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';

interface Props {
    form: UseFormReturn<CheckoutFormValues>
    onComplete: () => void
}

const DeliveryPickupSelector = ({ form, onComplete}: Props) => {
    const {businessHours, isLoading, error, getAvailablePickupTimes} = useBusinessHours();
    const deliveryMethod = form.watch('delivery.method');
    const selectedDate = form.watch('delivery.pickupDate');
    const availableTimes = selectedDate ? getAvailablePickupTimes(new Date(selectedDate)) : [];

    const handleContinue = () => {
        if(deliveryMethod === "pickup") {
            if(form.getValues('delivery.pickupDate') && form.getValues('delivery.pickupTime')) {
                onComplete();
            }
        } else {
            form.trigger('delivery.address');
            if(Object.values(form.getValues('delivery.address') || {}).every(Boolean)) {
                onComplete();
            }
        }
    }

    if(isLoading) return <div>Loading available times...</div> 
    if(error) return <div>Error loading business hours</div>

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                    Choose Pickup Date and Time
                </h3>
                <p className="mt-2 text-gray-600">
                    Orders can be picked up from 9:00 AM to 5:30 PM
                    Ordering window is from 9:00 AM to 2:00 PM. Last order is at 1:45 PM
                </p>
            </div>
            {/* <FormField 
                control={form.control}
                name="delivery.method"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Delivery Method</FormLabel>
                        <FormControl>   
                            <RadioGroup 
                                onValueChange={field.onChange}
                                className="space-y-4"

                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pickup" id="pickup" />
                                    <Label htmlFor="pickup">Pickup</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="delivery" id="delivery" />
                                    <Label htmlFor="delivery">Delivery</Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}
            
            {deliveryMethod === 'pickup' && (
                <div className="space-y-4 my-8">
                    <FormField 
                        control={form.control}
                        name="delivery.pickupDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pickup Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={`
                                                    w-full
                                                    justify-start
                                                    text-left font-normal
                                                    ${!field.value && 'text-muted-foreground'}
                                                `}
                                            >
                                                {field.value ? (
                                                    format(new Date(field.value), 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) => {
                                                if (!businessHours) return true;
                                       
                                                const dayOfWeek = format(date, 'EEEE').toLowerCase();
                                                const dateStr = format(date, 'yyyy-MM-dd');
                                                const now = new Date();
                                                const today = format(now, 'yyyy-MM-dd');
                                       
                                                // For today's date, check if it's past ordering cutoff time
                                                if (dateStr === today) {
                                                    const orderingEnd = parse('13:45:00', 'HH:mm:ss', now);
                                                    if (now > orderingEnd) return true;
                                                }
                                       
                                                // Disable past dates
                                                if (dateStr < today) return true;
                                       
                                                // Check if there's a special schedule
                                                const specialSchedule = businessHours.specialSchedules.find(
                                                    schedule => format(new Date(schedule.date), 'yyyy-MM-dd') === dateStr
                                                );
                                                if (specialSchedule && !specialSchedule.isOpen) return true;
                                       
                                                // Check regular hours
                                                const regularHours = businessHours.regularHours.find(h => h.day === dayOfWeek);
                                                if (!regularHours?.isOpen) return true;
                                                
                                                return false;
                                            }}
                                            className="rounded-md border mx-auto"
                                        />
                                    </PopoverContent>
                                </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                </div>
            )}

            {selectedDate && (
                <div className="mb-8 rounded-md">
                    <FormField
                        control={form.control}
                        name="delivery.pickupTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pickup Time</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a time" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {availableTimes.filter((time) => {
                                          if (format(new Date(selectedDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                                            return isAfter(parse(time, 'h:mm aaa', new Date()), new Date());
                                        } else {
                                            return true;
                                        }}).map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}

            {/* {deliveryMethod === "delivery" && (
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="delivery.address.street"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="delivery.address.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="delivery.address.state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="delivery.address.zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )} */}

            <Button
                type="button"
                onClick={handleContinue}
                className="w-full bg-red-600 text-white"
            >
                Continue
            </Button>
        </div>
    )
}

export default DeliveryPickupSelector