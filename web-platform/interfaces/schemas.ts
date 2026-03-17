import { z } from "zod";


export const signUpSchema = z.object({
  email: z.string().email("Невірний формат email"),
  username: z.string().min(3, "Юзернейм має бути не менше 3 символів").max(50),
  password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});


export const productSchema = z.object({
 name: z.string().min(2, "Назва занадто коротка"),
  quantity: z.number().positive("Кількість має бути більша за 0"),
  unit: z.string(),
  expiryDate: z.string().refine((val) => {
    if (!val) return true; 
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: "Продукт вже зіпсувався або дата введена некоректно"
  }),
  ownerId: z.string()
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