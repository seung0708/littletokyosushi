'use client'
import {UseFormReturn} from 'react-hook-form'
import {type CheckoutFormValues} from '@/types/checkout';
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useBusinessHours } from '@/app/hooks/useBusinessHours'
import { format, parse, isAfter } from 'date-fns';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';


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
        <div className="w-full max-w-md mx-auto text-white">
            <div className="mb-6">
                <h3 className="text-2xl font-bold">
                    Choose Pickup Date and Time
                </h3>
            </div>
            <FormField 
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
            />
            
            {deliveryMethod === 'pickup' && (
                <div className="space-y-4 my-8">
                    <FormField 
                        control={form.control}
                        name="delivery.pickupDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-lg font-semibold mb-2">Select Pickup Date</FormLabel>
                                <div className="space-y-4">
                                    {field.value && (
                                        <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg">{format(new Date(field.value), 'EEEE')}</span>
                                                <span className="text-sm text-gray-400">{format(new Date(field.value), 'MMMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
                                        <div className="p-3 border-b border-white/10">
                                            <div className="text-center space-y-2">
                                                <p className="text-sm font-medium">Business Hours</p>
                                                <p className="text-xs text-gray-400">
                                                    Mon-Sat: 9:00 AM - 5:30 PM<br />
                                                    Last order at 1:45 PM
                                                </p>
                                            </div>
                                        </div>
                                        <Calendar
                                            className="flex justify-center items-center text-white"
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
                                                    if (isAfter(now, orderingEnd)) return true;
                                                }
                                       
                                                // Disable past dates
                                                if (dateStr < today) return true;
                                       
                                                // Check if there's a special schedule
                                                const specialSchedule = businessHours.specialSchedules.find(
                                                    schedule => format(new Date(schedule.date), 'yyyy-MM-dd') === dateStr
                                                );
                                                if (specialSchedule) {
                                                    return !specialSchedule.isOpen;
                                                }
                                       
                                                // Check regular schedule
                                                const regularHours = businessHours.regularHours.find(
                                                    hours => hours.day === dayOfWeek
                                                );
                                                return !regularHours?.isOpen;
                                            }}
                                            classNames={{
                                                months: "space-y-4",
                                                month: "space-y-4",
                                                caption: "flex justify-center pt-1 relative items-center text-white",
                                                caption_label: "text-sm font-medium text-white",
                                                nav: "space-x-1 flex items-center",
                                                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                                                nav_button_previous: "absolute left-1",
                                                nav_button_next: "absolute right-1",
                                                table: "w-full border-collapse space-y-1",
                                                head_row: "flex justify-center",
                                                head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                                                row: "flex w-full mt-2 justify-center",
                                                cell: "h-9 w-9 text-center text-sm relative p-0 focus-within:relative focus-within:z-20",
                                                day: "h-9 w-9 p-0 font-normal text-white hover:bg-red-500 hover:text-white rounded-md",
                                                day_selected: "bg-red-600 text-white hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white rounded-md",
                                                day_today: "bg-red-100 text-red-600 rounded-md",
                                                day_outside: "text-gray-600",
                                                day_disabled: "text-gray-600 opacity-50 cursor-not-allowed",
                                                day_hidden: "invisible",
                                            }}
                                        />
                                        <div className="p-3 border-t border-white/10">
                                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                <span>Special hours may apply</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                        <SelectTrigger className="bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 text-white">
                                            <SelectValue placeholder="Select a time" className="text-white" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-black/90 border border-white/10">
                                        {availableTimes.filter((time) => {
                                          if (format(new Date(selectedDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                                            return isAfter(parse(time, 'h:mm aaa', new Date()), new Date());
                                        } else {
                                            return true;
                                        }}).map((time) => (
                                            <SelectItem 
                                                key={time} 
                                                value={time}
                                                className="text-white hover:bg-red-600 focus:bg-red-600 focus:text-white"
                                            >
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