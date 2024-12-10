import { z } from 'zod';
export const imageSchema =  z.instanceof(File)
  .refine(
    (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
    { message: "Invalid image file type" }
  )



