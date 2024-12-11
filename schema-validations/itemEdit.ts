import { z } from 'zod';

export const itemEditSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  price: z.number()
    .min(0, 'Price must be greater than 0')
    .max(1000, 'Price must be less than 1000'),
  quantity_in_stock: z.number()
    .min(0, 'Stock must be greater than 0')
    .max(1000, 'Stock must be less than 1000'),
  low_stock_threshold: z.number()
    .min(0, 'Low stock threshold must be greater than 0')
    .max(1000, 'Low stock threshold must be less than 1000'),
  category_id: z.number(),
  is_available: z.boolean(),
  special_instructions: z.string().optional(),
  image_urls: z.array(z.string()),
  category_name: z.string(),
  sync_status: z.boolean()
});

export type ItemEditFormData = z.infer<typeof itemEditSchema>;
