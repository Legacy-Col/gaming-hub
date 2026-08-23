import { useAuthContext } from "@/context/AuthContext"
import { api } from "@/lib/api"
import type { LoginData, RegisterData, ForgotPasswordData } from "@/schemas/authSchemas"
import {useState} from 'react'



interface AuthState {
    isLoading: boolean
    error: string | null
}

export function useAuth() {
    const { login, logout } = useAuthContext()
    const [state, setState] = useState<AuthState>({
        isLoading: false,
        error: null,
    })

    const setLoading = (isLoading: boolean) =>
        setState(s => ({ ...s, isLoading }))

    const setError = (error: string | null) =>
        setState(s => ({ ...s, error }))

    const handleLogin = async (data: LoginData) => {
        try {
            setLoading(true)
            setError(null)

            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                const mockUser = {
                    id: '1',
                    username: 'Kaizen',
                    email: data.email,
                    tokens: 500,
                    joinedAt: new Date().toISOString(),
                    // MOCK ONLY: log in with any email containing "admin" (e.g. admin@test.com)
                    // to test admin features locally. The real role always comes from the
                    // backend once it's connected — this line does nothing in production.
                    role: data.email.toLowerCase().includes('admin') ? 'admin' as const : 'user' as const,
                }
                login('mock-token-12345', mockUser)
                return { success: true }
            }

            const response = await api.auth.login(data.email, data.password)
            login(response.data.token, response.data.user)
            return { success: true }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
            return { success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (data: RegisterData) => {
        try {
            setLoading(true)
            setError(null)

            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                const mockUser = {
                    id: '1',
                    username: data.name,
                    email: data.email,
                    tokens: 0,
                    joinedAt: new Date().toISOString(),
                    // MOCK ONLY — see note in handleLogin above
                    role: data.email.toLowerCase().includes('admin') ? 'admin' as const : 'user' as const,
                }
                login('mock-token-12345', mockUser)
                return { success: true }
            }

            const response = await api.auth.register({
                username: data.name,
                email: data.email,
                password: data.password,
            })
            login(response.data.token, response.data.user)
            return { success: true }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
            return { success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (data: ForgotPasswordData) => {
        try {
            setLoading(true)
            setError(null)

            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                return { success: true }
            }

            await api.auth.forgotPassword(data.email)
            return { success: true }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email')
            return { success: false }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
    }

    return {
        ...state,
        handleLogin,
        handleRegister,
        handleForgotPassword,
        handleLogout,
    }
}