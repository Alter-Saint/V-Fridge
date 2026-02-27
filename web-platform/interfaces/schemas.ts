import { z } from "zod";


export const signUpSchema = z.object({
  email: z.string().email("Невірний формат email"),
  username: z.string().min(3, "Юзернейм має бути не менше 3 символів").max(50),
  password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});


export const productSchema = z.object({
  name: z.string().min(1, "Назва обов'язкова").max(255),
  description: z.string().optional().nullable(),
  
  quantity: z.coerce.number().min(0).transform((val) => String(val)),
  unit: z.string().min(1).max(20),
 
  expiryDate: z.string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Невірний формат дати")
    .transform((val) => val ? new Date(val).toISOString() : null),
});


export const updateProductSchema = productSchema.partial().extend({
  id: z.coerce.number(),
});


export const chatSchema = z.object({
  content: z.string().min(1, "Повідомлення не може бути порожнім"),
});
export const updateSettingsSchema = z.object({
  username: z.string().min(3).max(50).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type ProductInput = z.infer<typeof productSchema>;