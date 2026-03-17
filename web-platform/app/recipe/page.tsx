'use client';
import Chat from "@/components/chat";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function RecipePage() {
  const { data: session } = useSession();

  return (
    <div className="h-screen w-full flex flex-col bg-background p-2 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <header className="flex flex-col items-center space-y-2 shrink-0">
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">Gemini 1.5 Flash</span>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
              AI Recipe Assistant
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-medium italic">
              Шукаємо ідеї для {session?.user?.username || "вашого обіду"}
            </p>
          </div>
        </header>

        <main className="flex-1 min-h-0 relative group">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent rounded-[2rem] -z-10 blur-3xl opacity-50" />
          
          <div className="h-full w-full rounded-[2rem] border shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col border-primary/10">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Secure AI Session</p>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <Chat />
            </div>
          </div>
        </main>
        
        <footer className="py-2 shrink-0">
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter opacity-50">
            Powered by V-Fridge AI • Responses may vary based on your inventory
          </p>
        </footer>

      </div>
    </div>
  );
}