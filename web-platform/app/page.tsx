'use client';
import { AddProducts } from "@/components/add-products";
import { ProductList } from "@/components/ProductList";
import { useSession } from "next-auth/react";

export default function DashBoard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
              {session?.user?.username ? `Вітаємо, ${session.user.username}!` : "Dashboard"}
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Керуйте вашим холодильником V-Fridge
            </p>
          </div>
          <div className="hidden md:block">
             <AddProducts />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <div className="md:hidden w-full">
              <AddProducts />
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Статистика</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-secondary">
                  <p className="text-sm text-muted-foreground">Всього продуктів</p>
                  <p className="text-2xl font-bold italic">Завантаження...</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8 order-1 lg:order-2">
            <div className="rounded-2xl border shadow-xl bg-card overflow-hidden">
              <div className="p-6 border-b bg-muted/30">
                <h3 className="font-bold text-lg">Ваш інвентар</h3>
              </div>
              <div className="p-4 md:p-6 min-h-100">
                <ProductList />
              </div>
            </div>
          </section>
        </main>

      </div>
    </div>
  );
}