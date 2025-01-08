import {z} from 'zod'

export const checkoutSchema = z.object({
    customer: z.object({
        email: z.string().email("Valid email is required"),
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(10, "Phone number is required"),
    }),
    delivery: z.object({
        method: z.enum(["delivery", "pickup"], {required_error: "Please select a delivery method"}),
        pickupDate: z.string().optional(),
        pickupTime: z.string().optional(),
        address: z.object({
            street1: z.string().min(1, "Valid street is required"),
            street2: z.string().optional(),
            city: z.string().min(1, "City is required"),
            state: z.string().min(1, "State is required"),
            zipCode: z.string().min(1, "Zip code is required"),
        })
    }).refine(data => {
        if (data.method === "pickup") {
            return data.pickupDate && data.pickupTime
        }
        if(data.method === "delivery") {
            return data.address.street1 && data.address.city && data.address.state && data.address.zipCode
        }
        return true;
    }, 'Please complete all required fields')
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>