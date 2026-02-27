import { z } from "zod";

// Схема для реєстрації (SignUp)
export const signUpSchema = z.object({
  email: z.string().email("Невірний формат email"),
  username: z.string().min(3, "Юзернейм має бути не менше 3 символів").max(50),
  password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});

// Схема для продуктів (V-Fridge)
export const productSchema = z.object({
  name: z.string().min(1, "Назва обов'язкова").max(255),
  description: z.string().optional().nullable(),
  // Автоматично перетворюємо вхідні дані на число, а потім на рядок для Drizzle numeric
  quantity: z.coerce.number().min(0).transform((val) => String(val)),
  unit: z.string().min(1).max(20),
  // Приймаємо рядок, перевіряємо чи це дата, і робимо ISO string або null
  expiryDate: z.string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Невірний формат дати")
    .transform((val) => val ? new Date(val).toISOString() : null),
});

// Схема для оновлення продукту (PATCH)
export const updateProductSchema = productSchema.partial().extend({
  id: z.coerce.number(), // ID обов'язковий для оновлення
});

// Схема для чату
export const chatSchema = z.object({
  content: z.string().min(1, "Повідомлення не може бути порожнім"),
});
export const updateSettingsSchema = z.object({
  username: z.string().min(3).max(50).optional(),
});
// Витягуємо типи зі схем (Type Inference)
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ProductInput = z.infer<typeof productSchema>;