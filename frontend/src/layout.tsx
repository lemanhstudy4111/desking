import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { Outlet } from "react-router"

export default function Layout() {
  return (
    <div className="flex min-h-svh p-6">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="-ml-1" />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
// export default function Layout() {
//   return (
//     <div className="flex min-h-svh p-6">
//       <SidebarProvider>
//         <AppSidebar />
//         <SidebarInset>
//           <SidebarTrigger className="-ml-1" />
//         </SidebarInset>
//       </SidebarProvider>
//     </div>
//   )
// }
