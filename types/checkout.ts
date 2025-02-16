import {z} from 'zod'

export const checkoutSchema = z.object({
    customer: z.object({
        id: z.string().optional(),
        guestEmail: z.string().optional().or(z.string().email("Valid email is required")),  // Make base validation optional
        guestName: z.string().optional().or(z.string().min(1, "Name is required")),  // Make base validation optional
        phone: z.string().min(10, "Phone number is required"),
        signinEmail: z.string().optional().or(z.string().email("Valid email is required")),  // Make base validation optional
        password: z.string().optional().or(z.string().min(8, "Password must be at least 8 characters")),  // Make base validation optional
    }).refine(data => {
        // Guest checkout mode
        if (!data.signinEmail && !data.password) {
            return !!data.guestName && !!data.guestEmail;
        }
        // Sign in mode
        if (data.signinEmail || data.password) {
            return !!data.signinEmail && !!data.password;
        }
        return false;
    }, {
        message: "Please complete either the sign in or guest checkout form"
    }),
    delivery: z.object({
        method: z.enum(["delivery", "pickup"], {required_error: "Please select a delivery method"}),
        pickupDate: z.date().optional(),
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