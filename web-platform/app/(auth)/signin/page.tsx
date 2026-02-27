"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

// Схема валідації для форми входу
const signInSchema = z.object({
  email: z.string().email("Некоректний формат email"),
  password: z.string().min(1, "Пароль обов'язковий"),
});

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Клієнтська валідація через Zod
    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "Некоректні дані";
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Обробляємо редірект вручну для кращого UX
    });

    if (result?.error) {
      // NextAuth повертає загальну помилку, якщо authorize повернув null
      setError("Невірний email або пароль");
      setLoading(false);
    } else {
      // Успішний вхід
      router.push("/");
      router.refresh(); // Обов'язково для оновлення сесії в серверних компонентах (сайдбар)
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-secondary/10 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Вхід у V-Fridge</CardTitle>
          <CardDescription>
            Введіть ваші дані
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
                required 
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Пароль" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>  
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Входимо...
                </>
              ) : (
                "Увійти"
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Ще не маєте акаунту?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Зареєструватися
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}