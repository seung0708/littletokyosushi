import {z} from 'zod'

export const checkoutSchema = z.object({
    customer: z.object({
        name: z.string().min(1, "Customer name is required"),
        phone: z.string().min(10, "Phone number is required"),
        email: z.email({ pattern: z.regexes.email })
    }),
    delivery: z.object({
        method: z.enum(["delivery", "pickup"], {error: "Please select a delivery method"}),
        pickupDate: z.date().optional(),
        pickupTime: z.string().optional(),
        address: z.object({
            address1: z.string().min(1, "Valid street is required"),
            address2: z.string().optional(),
            city: z.string().min(1, "City is required"),
            state: z.string().min(2).max(2),
            zipCode: z.string().min(1).max(5),
        }).optional()
    }).refine(data => {
        if (data.method === "pickup") {
            return data.pickupTime && data.pickupTime
        }
        if(data.method === "delivery" && data.address) {
            return data.address.address1 && data.address.city && data.address.state && data.address.zipCode
        }
        return true;
    }, 'Please complete all required fields')
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>