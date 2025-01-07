'use client'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface DeliveryPickupSelectorProps {
    selectedMethod: 'pickup' | 'delivery' | null
    onMethodSelect: (method: 'pickup' | 'delivery') => void
    onComplete: () => void
}

interface DeliveryAddress {
    address: string
    city: string
    state: string
    zipCode: string
}

const DeliveryPickupSelector: React.FC<DeliveryPickupSelectorProps> = ({
    selectedMethod,
    onMethodSelect,
    onComplete
}) => {
    const [date, setDate] = useState<Date | null>(new Date())
    const now = new Date()
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
        address: '',
        city: '',
        state: '',
        zipCode: ''
    })

    const hours = {
        pickup: {start: 9, end: 18},
        delivery: {start: 9, end: 14}
    }

    const filterPickupTime = (time: Date) => {
        const hour = time.getHours()
        return hour >= hours.pickup.start && hour <= hours.pickup.end
    }

    const filterDeliveryTime = (time: Date) => {
        const hour = time.getHours()
        return hour >= hours.delivery.start && hour <= hours.delivery.end
    }

    const handleAddressChange = (field: keyof DeliveryAddress) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDeliveryAddress(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }

    const handleContinue = () => {
        if (selectedMethod === 'pickup' || 
            (selectedMethod === 'delivery' && 
             Object.values(deliveryAddress).every(value => value !== ''))) {
            onComplete()
        }
    }

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

            <RadioGroup className="space-y-4 mb-8">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem
                        value="pickup"
                        id="pickup"
                        checked={selectedMethod === 'pickup'}
                        onClick={() => onMethodSelect('pickup')}
                    />
                    <Label htmlFor="pickup">Pickup</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                        value="delivery"
                        id="delivery"
                        checked={selectedMethod === 'delivery'}
                        onClick={() => onMethodSelect('delivery')}
                    />
                    <Label htmlFor="delivery">Delivery</Label>
                </div>
            </RadioGroup>

            {selectedMethod === 'delivery' && (
                <div className="space-y-4 mb-8">
                    <Input
                        placeholder="Street Address"
                        value={deliveryAddress.address}
                        onChange={handleAddressChange('address')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="City"
                            value={deliveryAddress.city}
                            onChange={handleAddressChange('city')}
                        />
                        <Input
                            placeholder="State"
                            value={deliveryAddress.state}
                            onChange={handleAddressChange('state')}
                        />
                    </div>
                    <Input
                        placeholder="ZIP Code"
                        value={deliveryAddress.zipCode}
                        onChange={handleAddressChange('zipCode')}
                    />
                </div>
            )}

            {selectedMethod === 'pickup' && (
                <div className="mb-8 p-4 rounded-md">
                    <DatePicker
                        selected={date}
                        onChange={(date: Date) => setDate(date)}
                        showTimeSelect
                        timeIntervals={15}
                        minDate={now}
                        minTime={filterPickupTime}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        className="w-full")}
                        maxTime={hours.pickup.end}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Time"
                        className="w-full"
                    />
                    <p className="mt-2 text-gray-600">
                        Pickup hours: {hours.pickup.start} - {hours.pickup.end}
                    </p>
                </div>
            )}

            <Button
                onClick={handleContinue}
                disabled={!selectedMethod || (
                    selectedMethod === 'delivery' && 
                    Object.values(deliveryAddress).some(value => value === '')
                )}
                className="w-full bg-red-600 text-white"
            >
                Continue
            </Button>
        </div>
    )
}

export default DeliveryPickupSelector