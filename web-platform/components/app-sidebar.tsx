import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar>
       <SidebarHeader>
        <h2 className="text-2xl font-bold flex justify-center items-center">V-Fridge</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu className="flex justify-center items-center">
          <SidebarMenuItem>
            <Link href="/">Dashboard</Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/recipe">Recipes</Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/settings">Settings</Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}