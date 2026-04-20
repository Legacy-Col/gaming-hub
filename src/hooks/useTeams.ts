import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { Team, TeamQueryParams } from '@/types'

const FALLBACK_TEAMS: Team[] = [
  { id: '1', rank: 1, name: 'ẸKỌ WOLVES',     tag: 'EKW', game: 'Valorant',         wins: 28, losses: 4,  points: 4320, tokens: 840, trend: 'up' },
  { id: '2', rank: 2, name: 'LAGOS LIONS',     tag: 'LGL', game: 'FIFA 25',          wins: 25, losses: 7,  points: 3880, tokens: 740, trend: 'up' },
  { id: '3', rank: 3, name: 'ABUJA ACES',      tag: 'ABA', game: 'Call of Duty: MW3',wins: 22, losses: 9,  points: 3450, tokens: 660, trend: 'stable' },
  { id: '4', rank: 4, name: 'KANO STRIKERS',   tag: 'KNS', game: 'eFootball',        wins: 19, losses: 11, points: 2990, tokens: 570, trend: 'down' },
  { id: '5', rank: 5, name: 'PHC PREDATORS',   tag: 'PHP', game: 'Valorant',         wins: 17, losses: 10, points: 2640, tokens: 510, trend: 'up' },
  { id: '6', rank: 6, name: 'ENUGU EAGLES',    tag: 'ENG', game: 'Street Fighter 6', wins: 15, losses: 13, points: 2230, tokens: 440, trend: 'down' },
]

export function useTeams(params: TeamQueryParams = {}) {
  return useApi<Team[]>(
    () => api.teams.list(params),
    FALLBACK_TEAMS,
    [JSON.stringify(params)],
  )
}
