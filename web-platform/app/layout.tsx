import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import SessionProvider from "@/providers/session-provider";
import { Toaster } from 'sonner';
import { Separator } from "@/components/ui/separator";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V-Fridge",
  description: "Manage your products with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <SessionProvider>
          <SidebarProvider className="h-full overflow-hidden">
            <AppSidebar />
            <SidebarInset className="h-full flex flex-col overflow-hidden">
              <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:hidden">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <span className="font-bold text-primary">V-Fridge</span>
              </header>
              <main className="flex-1 overflow-hidden relative">
                {children}
                <Toaster richColors position="top-center" />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}