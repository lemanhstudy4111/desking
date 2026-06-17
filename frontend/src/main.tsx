import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import Home from "./pages/home.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import { Booking } from "./pages/booking.tsx"
import Layout from "./layout.tsx"
import AuthPageLayout from "./pages/authLayout.tsx"
import { LoginForm } from "./components/login-form.tsx"
import { SignupForm } from "./components/signup-form.tsx"
import Login from "./pages/login.tsx"
import { ProtectedRoute } from "./components/protected-route.tsx"
import { AuthContext } from "./hooks/use-auth.ts"
import { AuthProvider } from "./hooks/auth-reducer.tsx"

const router = createBrowserRouter([
  {
    Component: AuthPageLayout,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignupForm />,
      },
    ],
  },
  {
    Component: Layout,
    children: [
      {
        path: "/",
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/book",
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
