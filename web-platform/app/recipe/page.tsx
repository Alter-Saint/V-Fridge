'use client';
import Chat from "@/components/chat";
import { useSession } from "next-auth/react";

export default function RecipePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="py-4 shrink-0">
        <h2 className="text-3xl font-bold text-center">AI Recipe Assistant</h2>
        <p className="text-sm text-center text-muted-foreground italic">
          Шукаємо ідеї для {session?.user?.username || "вас"}
        </p>
      </header>
      
      <main className="flex-1 min-h-0 p-2 md:p-4">
        <Chat />
      </main>
    </div>
  );
}