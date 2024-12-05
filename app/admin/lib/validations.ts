import { z } from 'zod';

export const loginFormSchema = z.object({
    email: z.string({
      required_error: 'Email is required'
    }),
    password: z.string({
      required_error: 'Password is required'
    })
  })

export const addNewItemSchema = z.object({
    name: z.string()
        .min(4, 'Must be at least 4 characters'), 
    description: z.string()
        .min(20, 'Must be at least 20 characters'), 
    
})