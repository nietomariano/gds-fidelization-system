"use client";

import { Home, Receipt, Store, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Pathname } from "@/config/Pathname";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: Pathname.CUSTOMER_DASHBOARD,
  },
  {
    title: "Mis Comercios",
    icon: Store,
    url: Pathname.CUSTOMER_BUSINESSES,
  },
  {
    title: "Historial",
    icon: Receipt,
    url: Pathname.CUSTOMER_HISTORY,
  },
  {
    title: "Perfil",
    icon: User,
    url: Pathname.CUSTOMER_PROFILE,
  },
];

export default function CustomerSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <User className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Portal Cliente</span>
            <span className="text-xs text-muted-foreground">Loyalty App</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Card className="bg-sidebar-accent p-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Usuario</span>
              <span className="text-xs text-muted-foreground">Cliente</span>
            </div>
          </div>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
