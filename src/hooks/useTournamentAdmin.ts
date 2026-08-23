import { useState } from 'react'
import { api } from '@/lib/api'
import type { TournamentDetail, CreateTournamentPayload, UpdateTournamentPayload } from '@/types'

const isMock = () =>
  !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')

export function useTournamentAdmin() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const createTournament = async (payload: CreateTournamentPayload): Promise<TournamentDetail | null> => {
    try {
      setIsSaving(true); setError(null); setSuccess(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 1000))
        const now = new Date().toISOString()
        const mock: TournamentDetail = {
          id: `mock-${Date.now()}`,
          ...payload,
          status: 'upcoming',
          registeredTeams: 0,
          matches: [],
          standings: [],
          participants: [],
        }
        setSuccess('Tournament created (mock mode — connect the backend to persist it for real).')
        return mock
      }

      const res = await api.tournaments.create(payload)
      setSuccess('Tournament created.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tournament')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const updateTournament = async (id: string, payload: UpdateTournamentPayload): Promise<TournamentDetail | null> => {
    try {
      setIsSaving(true); setError(null); setSuccess(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 800))
        setSuccess('Tournament updated (mock mode).')
        return null
      }

      const res = await api.tournaments.update(id, payload)
      setSuccess('Tournament updated.')
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tournament')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const deleteTournament = async (id: string): Promise<boolean> => {
    try {
      setIsSaving(true); setError(null)

      if (isMock()) {
        await new Promise(r => setTimeout(r, 700))
        return true
      }

      await api.tournaments.delete(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tournament')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, error, success, createTournament, updateTournament, deleteTournament }
}