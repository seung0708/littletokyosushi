import { z } from 'zod';

export const signinFormSchema = z.object({
    email: z.string({
      message: 'Email is required'
    }),
    password: z.string({
      message: 'Password is required'
    }),
})




