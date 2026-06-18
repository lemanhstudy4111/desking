import React, { useReducer, useCallback, useEffect } from "react"
import { AuthContext } from "./use-auth"
import { fetchData } from "@/services/fetch"

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

type AuthState = {
  user: User | null
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CHECK_AUTH_START" }
  | { type: "CHECK_AUTH_SUCCESS"; payload: User }
  | { type: "CHECK_AUTH_ERROR" }

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null }
    case "LOGIN_SUCCESS":
      return { ...state, isLoading: false, user: action.payload }
    case "LOGIN_ERROR":
      return { ...state, isLoading: false, error: action.payload }
    case "LOGOUT":
      return { ...state, user: null }
    case "CHECK_AUTH_START":
      return { ...state, isLoading: true }
    case "CHECK_AUTH_SUCCESS":
      return { ...state, isLoading: false, user: action.payload }
    case "CHECK_AUTH_ERROR":
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const urlencoded = new URLSearchParams()
      urlencoded.append("email", email)
      urlencoded.append("password", password)
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: urlencoded,
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const user: User = await response.json()

      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetchData("/auth/signout", "GET", undefined, undefined, undefined)
    } finally {
      dispatch({ type: "LOGOUT" })
    }
  }, [])

  const checkAuth = async () => {
    dispatch({ type: "CHECK_AUTH_START" })
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        dispatch({ type: "CHECK_AUTH_ERROR" })
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Auth check failed")
      }

      const user: User = await response.json()
      dispatch({ type: "CHECK_AUTH_SUCCESS", payload: user })
    } catch {
      dispatch({ type: "CHECK_AUTH_ERROR" })
    }
  }
  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.user !== null,
        isLoading: state.isLoading,
        error: state.error,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
