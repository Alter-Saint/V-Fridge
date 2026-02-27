"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function SignUpPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || "Помилка");

    // Авто-логін
    const loginResult = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (loginResult?.error) router.push("/signin");
    else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-secondary/10">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-center">Реєстрація</CardTitle></CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <p className="text-destructive text-center text-sm">{error}</p>}
            <Input placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} required />
            <Input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
            <Input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
          </CardContent>
          <CardFooter><Button type="submit" className="w-full">Створити і увійти</Button></CardFooter>
        </form>
      </Card>
    </div>
  );
}