import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import Home from "./pages/home.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import { Booking } from "./pages/booking.tsx"
import Layout from "./layout.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/book",
    element: <Booking />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </ThemeProvider>
  </StrictMode>
)
