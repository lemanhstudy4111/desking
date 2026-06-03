import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import type { ReactElement } from "react"

export function App({ children }: { children: ReactElement }) {
  return (
    <div className="flex min-h-svh p-6">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="-ml-1" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default App
