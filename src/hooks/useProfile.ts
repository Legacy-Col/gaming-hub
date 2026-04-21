import { useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { api } from '@/lib/api'
import type { ProfileFormData } from '@/schemas/profileSchemas'

export function useProfile() {
    const { user, updateUser } = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)
    const [error,     setError]     = useState<string | null>(null)
    const [success,   setSuccess]   = useState(false)

    const updateProfile = async (data: ProfileFormData) => {
        try {
            setIsLoading(true)
            setError(null)
            setSuccess(false)

            // ── MOCK — remove when backend is ready ──
            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                // Update user in context with new data
                if (user) {
                    updateUser({        
                        ...user,
                        username: data.username,
                    })
                }
                setSuccess(true)
                return
            }
            // ── END MOCK ──

            const res = await api.profile.update({
                username: data.username,
                bio: data.bio ?? '',
            })
            if (user) {
                updateUser(res.data) 
            }
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    const uploadAvatar = async (file: File) => {
        try {
            setIsLoading(true)
            setError(null)

            // ── MOCK — remove when backend is ready ──
            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                const mockUrl = URL.createObjectURL(file)
                if (user) {
                    updateUser({       
                        ...user,
                        avatarUrl: mockUrl,
                    })
                }
                return
            }
            // ── END MOCK ──

            const res = await api.profile.uploadAvatar(file)
            if (user) {
                updateUser({           
                    ...user,
                    avatarUrl: res.data.avatarUrl,
                })
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload avatar')
        } finally {
            setIsLoading(false)
        }
    }

    return { updateProfile, uploadAvatar, isLoading, error, success }
}