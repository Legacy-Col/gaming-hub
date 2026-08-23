import { useState } from 'react'
import { api } from '@/lib/api'
import type { TeamDetail, AdminCreateTeamPayload, AdminUpdateTeamPayload } from '@/types'

const isMock = () =>
  !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')

export function useTeamAdmin() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const createTeam = async (payload: AdminCreateTeamPayload): Promise<TeamDetail | null> => {
    try {
      setIsSaving(true); setError(null); setSuccess(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 900))
        const now = new Date().toISOString()
        const mock: TeamDetail = {
          id: `mock-${Date.now()}`,
          rank: 0,
          name: payload.name,
          tag: payload.tag,
          game: payload.game,
          wins: 0,
          losses: 0,
          points: 0,
          tokens: 0,
          trend: 'stable',
          logoUrl: payload.logoUrl,
          description: payload.description,
          captainId: 'pending-lookup',
          members: [],
          createdAt: now,
        }
        setSuccess('Team created (mock mode — connect the backend to persist it for real).')
        return mock
      }

      const res = await api.teams.adminCreate(payload)
      setSuccess('Team created.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const updateTeam = async (id: string, payload: AdminUpdateTeamPayload): Promise<TeamDetail | null> => {
    try {
      setIsSaving(true); setError(null); setSuccess(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 700))
        setSuccess('Team updated (mock mode).')
        return null
      }

      const res = await api.teams.adminUpdate(id, payload)
      setSuccess('Team updated.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const deleteTeam = async (id: string): Promise<boolean> => {
    try {
      setIsSaving(true); setError(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 600))
        return true
      }

      await api.teams.adminDelete(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, error, success, createTeam, updateTeam, deleteTeam }
}