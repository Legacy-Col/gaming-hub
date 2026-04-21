import { useState, useEffect } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { api } from '@/lib/api'
import type { TeamDetail, CreateTeamPayload } from '@/types'

const FALLBACK_TEAM: TeamDetail = {
    id:          '1',
    name:        'PHC PREDATORS',
    tag:         'PHP',
    game:        'Valorant',
    description: 'Port Harcourt\'s finest Valorant squad. We play to win.',
    rank:        5,
    wins:        17,
    losses:      10,
    points:      2640,
    tokens:      510,
    trend:       'up',
    captainId:   '1',
    createdAt:   '2025-01-15T00:00:00Z',
    members: [
    { id: '1', username: 'Kaizen',    role: 'captain', joinedAt: '2025-01-15T00:00:00Z', bio: 'Valorant IGL and entry fragger. 3 years competitive experience across Lagos and PHC circuits.' },
    { id: '2', username: 'Striker99', role: 'member',  joinedAt: '2025-02-01T00:00:00Z', bio: 'Duelist main. Former top 50 ranked player in West Africa server.' },
    { id: '3', username: 'PhcGod',    role: 'member',  joinedAt: '2025-02-15T00:00:00Z', bio: 'Sentinel specialist. Known for clutch performances in high pressure rounds.' },
    { id: '4', username: 'NaijaAim',  role: 'member',  joinedAt: '2025-03-01T00:00:00Z', bio: 'Initiator main with strong map knowledge across all competitive maps.' },
    { id: '5', username: 'LagosKing', role: 'member',  joinedAt: '2025-03-10T00:00:00Z', bio: 'Controller specialist. 2 years experience in local Lagos tournaments.' },
],
}

export function useTeam() {
    const { user } = useAuthContext()
    const [team,      setTeam]      = useState<TeamDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error,     setError]     = useState<string | null>(null)
    const [success,   setSuccess]   = useState<string | null>(null)

    // Fetch user's team on mount
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                setIsLoading(true)
// ── MOCK — remove when backend is ready ──
if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Toggle this to test both views:
    // true  = show team profile + members (to test scout feature)
    // false = show create/join forms
    const HAS_TEAM = true

    setTeam(HAS_TEAM ? FALLBACK_TEAM : null)
    return
}
// ── END MOCK ──

                const res = await api.teams.getMyTeam()
                setTeam(res.data)
            } catch {
                setTeam(null)  // null means user has no team yet
            } finally {
                setIsLoading(false)
            }
        }
        fetchTeam()
    }, [user])

    const createTeam = async (payload: CreateTeamPayload) => {
        try {
            setIsLoading(true)
            setError(null)
            setSuccess(null)

            // ── MOCK — remove when backend is ready ──
            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                const newTeam: TeamDetail = {
                    id:        '99',
                    ...payload,
                    rank:      0,
                    wins:      0,
                    losses:    0,
                    points:    0,
                    tokens:    0,
                    trend:     'stable',
                    captainId: user?.id ?? '1',
                    createdAt: new Date().toISOString(),
                    members: [{
                        id:       user?.id ?? '1',
                        username: user?.username ?? 'Player',
                        role:     'captain',
                        joinedAt: new Date().toISOString(),
                    }],
                }
                setTeam(newTeam)
                setSuccess('Team created successfully!')
                return
            }
            // ── END MOCK ──

            const res = await api.teams.create(payload)
            setTeam(res.data)
            setSuccess('Team created successfully!')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create team')
        } finally {
            setIsLoading(false)
        }
    }

    const joinTeam = async (teamId: string) => {
        try {
            setIsLoading(true)
            setError(null)
            setSuccess(null)

            // ── MOCK — remove when backend is ready ──
            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                setTeam(FALLBACK_TEAM)
                setSuccess('Successfully joined the team!')
                return
            }
            // ── END MOCK ──

            await api.teams.join(teamId)
            const res = await api.teams.get(teamId)
            setTeam(res.data)
            setSuccess('Successfully joined the team!')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to join team')
        } finally {
            setIsLoading(false)
        }
    }

    const leaveTeam = async () => {
        if (!team) return
        try {
            setIsLoading(true)
            setError(null)

            // ── MOCK — remove when backend is ready ──
            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                setTeam(null)
                return
            }
            // ── END MOCK ──

            await api.teams.leave(team.id)
            setTeam(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to leave team')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        team,
        isLoading,
        error,
        success,
        createTeam,
        joinTeam,
        leaveTeam,
    }
}