import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "@/context/AuthContext"
import { api } from "@/lib/api"
import type { LoginData, RegisterData, ForgotPasswordData } from "@/schemas/authSchemas"

interface AuthState {
    isLoading: boolean
    error: string | null
}

export function useAuth() {
    const { login, logout } = useAuthContext()
    const navigate = useNavigate()
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

            // ── MOCK — remove when backend is ready ──
            if (import.meta.env.DEV) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                const mockUser = {
                    id: '1',
                    username: 'Kaizen',       // ← fixed
                    email: data.email,
                    tokens: 500,
                    joinedAt: new Date().toISOString(),
                }
                login('mock-token-12345', mockUser)
                navigate('/dashboard')
                return
            }
            // ── END MOCK ──

            const response = await api.auth.login(data.email, data.password)
            login(response.data.token, response.data.user)
            navigate('/dashboard')

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (data: RegisterData) => {
        try {
            setLoading(true)
            setError(null)

            // ── MOCK — remove when backend is ready ──
            if (import.meta.env.DEV) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                const mockUser = {
                    id: '1',
                    username: data.name,      // ← fixed — schema uses 'name'
                    email: data.email,
                    tokens: 0,
                    joinedAt: new Date().toISOString(),
                }
                login('mock-token-12345', mockUser)
                navigate('/dashboard')        // ← fixed — go to dashboard not login
                return
            }
            // ── END MOCK ──

            const response = await api.auth.register({
                username: data.name,          // ← fixed
                email: data.email,
                password: data.password,
            })
            login(response.data.token, response.data.user)
            navigate('/dashboard')            // ← fixed

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (data: ForgotPasswordData) => {
        try {
            setLoading(true)
            setError(null)

            // ── MOCK — remove when backend is ready ──
            if (import.meta.env.DEV) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                return
            }
            // ── END MOCK ──

            await api.auth.forgotPassword(data.email)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return {
        ...state,
        handleLogin,
        handleRegister,
        handleForgotPassword,
        handleLogout,
    }
}