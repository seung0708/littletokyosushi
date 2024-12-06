import { z } from 'zod';

export const imageSchema =  z.instanceof(File)
  .refine(
    (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
    { message: "Invalid image file type" }
  )

export const loginFormSchema = z.object({
    email: z.string({
      required_error: 'Email is required'
    }),
    password: z.string({
      required_error: 'Password is required'
    })
  })

