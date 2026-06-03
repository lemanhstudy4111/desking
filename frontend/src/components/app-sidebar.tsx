import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type React from "react"

const data = {
  navMain: [
    {
      title: "Home",
      isActive: true,
      url: "#",
    },
    {
      title: "Book a Space",
      isActive: true,
      url: "#",
    },
    {
      title: "My Bookings",
      isActive: true,
      url: "#",
    },
  ],
  footer: [
    {
      title: "Settings",
      isActive: true,
      url: "#",
    },
    {
      title: "My Profile",
      isActive: true,
      url: "#",
    },
    {
      title: "Sign In/Create your Account",
      isActive: false,
      url: "#",
    },
  ],
}

export function AppSidebar({ ...props }): React.ComponentProps<typeof Sidebar> {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1>ACCC Desk Booking</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url}>{item.title}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.footer.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url}>{item.title}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
