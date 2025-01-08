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
import { format, parse } from 'date-fns';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface Props {
    form: UseFormReturn<CheckoutFormValues>
    onComplete: () => void
}

const DeliveryPickupSelector = ({ form, onComplete}: Props) => {
    const {businessHours, isLoading, error, getAvailablePickupTimes} = useBusinessHours();
    console.log('businessHours', businessHours)
    const deliveryMethod = form.watch('delivery.method');
    console.log('deliveryMethod', deliveryMethod)
    const selectedDate = form.watch('delivery.pickupDate');
    console.log('selectedDate', selectedDate)
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

    if(isLoading) return <div>Laoding available times...</div> 
    if(error) return <div>Error loading business hours</div>

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                    Choose Delivery Method
                </h3>
                <p className="mt-2 text-gray-600">
                    Select how you'd like to receive your order
                </p>
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
                            <FormItem>
                                <FormLabel>Pickup Date</FormLabel>
                                <Calendar
                                   mode="single"
                                   selected={field.value ? new Date(field.value) : undefined}
                                   onSelect={field.onChange}
                                   disabled={(date) => {
                                       if (!businessHours) return true
                                       const dayOfWeek = format(date, 'EEEE').toLowerCase()
                                       const dateStr = format(date, 'yyyy-MM-dd')
                                       const now = new Date()
                                        if(format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                                            const orderingEnd = parse(businessHours.regularHours.find(h => h.day === dayOfWeek)?.orderingEnd!, 'HH:mm:ss', now) 
                                            if(format(now, 'h:mm aaa') === format(orderingEnd, 'h:mm aaa')) return true
                                        }   
                                       const specialSchedule = businessHours.specialSchedules.find(
                                           s => s.date === dateStr
                                       )
                                       
                                       if (specialSchedule) return !specialSchedule.isOpen
                                       const regularHours = businessHours.regularHours.find(
                                           h => h.day === dayOfWeek
                                       )
                                       return !regularHours?.isOpen
                                   }}
                                   className="rounded-md border"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
            )}

            {selectedDate && (
                <div className="mb-8 p-4 rounded-md">
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
                                        {availableTimes.map((time) => (
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

            {deliveryMethod === "delivery" && (
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
            )}

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