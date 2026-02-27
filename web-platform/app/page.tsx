'use client';
import { AddProducts } from "@/components/add-products";
import { ProductList } from "@/components/ProductList";
import { useSession } from "next-auth/react";

export default function DashBoard() {
  const { data: session } = useSession();

  return (
    <div className="h-full w-full flex flex-col items-center p-6 overflow-hidden">
      <div className="text-center mb-8 shrink-0">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {session?.user?.username ? `Вітаємо, ${session.user.username}!` : "Dashboard Page"}
        </h1>
        <p className="text-muted-foreground">Керуйте вашим холодильником V-Fridge</p>
      </div>

      <section className="w-full max-w-4xl border rounded-xl shadow-lg bg-card flex flex-col overflow-hidden min-h-0">
        <div className="p-6 border-b shrink-0 flex flex-col items-center gap-4">
          <p className="font-medium">Додати новий продукт</p>
          <AddProducts />
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-secondary/5">
           <ProductList />
        </div>
      </section>
    </div>
  );
}