import { z } from 'zod'

export const createdOrderSchema = z.object({
    customer: z.object({
        name: z.string().min(1, 'Customer name is required'),
        email: z.email('Invalid email address'),
        phone: z.string().min(1, 'Customer phone number is required')
    }),
    delivery: z.object({
        method: z.enum(['pickup', 'delivery']),
        pickupDate: z.string().optional(), 
        pickupTime: z.string().optional(),
        address: z.object({
            address1: z.string().min(1),
            address2: z.string().optional(),
            city: z.string().min(1),
            state: z.string().length(1),
            zipCode: z.string().min(5).max(5),
        }).optional()
    }), 
    total: z.number().positive('Total must be a positive number'),
    fees: z.object({
        subTotal: z.number().nonnegative('Sub-total cannot be negative'),
    }),
    cartItems: z.array(z.object({
        quantity: z.number().int().positive(),
        base_price: z.number().nonnegative(),
        menu_items: z.object({
            id: z.string(),
        }),
        cart_item_modifiers: z.array(z.object({
            modifier_option_id: z.string(),
            price: z.number().nonnegative(),
        })).optional()
    })).min(1, 'Cart cannot be empty')
})