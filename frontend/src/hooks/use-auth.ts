// import React, { createContext, useState } from "react"
// import type { User } from "./auth-reducer"

import { createContext, useContext } from "react"
import type { User } from "./auth-reducer"

// export interface AuthContextType {
//   user: User | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   error: string | null
//   login: (email: string, password: string) => Promise<void>
//   logout: () => Promise<void>
//   checkAuth: () => Promise<void>
// }

// export const AuthContext = createContext<AuthContextType | null>(null)

// export function useAuth() {
//   const [authed, setAuthed] = useState(false)
//   const login = async (formData) => {
//     const res = await fetch("http://localhost:3000/api/v1/auth/signin", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Access-Control-Allow-Origin": "http://localhost:3000",
//       },
//       credentials: "include",
//       body: formData,
//     })
//     const data = await res.json()
//     console.log("data ", data)
//     if (data.success == "true") {
//       setAuthed(true)
//     }
//     return data
//   }
//   const logout = async () => {
//     setAuthed(false)
//   }
//   return { authed, login, logout }
// }
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
