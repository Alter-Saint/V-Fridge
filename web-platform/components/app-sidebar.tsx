"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import Link from "next/link"
import { LayoutDashboard, UtensilsCrossed, Settings, LogIn, UserPlus, LogOut, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function AppSidebar() {
  const { data: session, status } = useSession();

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <h2 className="text-2xl font-bold text-center text-primary">V-Fridge</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/recipe"><UtensilsCrossed className="mr-2 h-4 w-4" /> Recipes</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          {status === "authenticated" ? (
            <SidebarMenuItem className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="truncate">{session.user?.username || session.user?.email}</span>
              </div>
              <SidebarMenuButton 
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="w-full justify-center bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem className="flex flex-col gap-2">
              <SidebarMenuButton asChild className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/signin"><LogIn className="mr-2 h-4 w-4" /> Sign In</Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild variant="outline" className="w-full justify-center">
                <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}