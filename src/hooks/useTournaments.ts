import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { Tournament, TournamentQueryParams } from '@/types'

const FALLBACK: Tournament[] = [
  { id: '1', title: 'Lagos Open Season 3',    game: 'Valorant',         status: 'live',     prizePool: '₦200,000', entryFee: '₦2,000', startDate: '2025-07-10', maxTeams: 16, registeredTeams: 14, format: 'bracket' },
  { id: '2', title: 'West Africa FIFA Cup',   game: 'FIFA 25',          status: 'upcoming', prizePool: '₦150,000', entryFee: null,      startDate: '2025-07-20', maxTeams: 32, registeredTeams: 18, format: 'round-robin' },
  { id: '3', title: 'CoD Domination Series',  game: 'Call of Duty: MW3',status: 'upcoming', prizePool: '₦100,000', entryFee: '₦1,500', startDate: '2025-07-25', maxTeams: 16, registeredTeams: 9,  format: 'bracket' },
]

export function useTournaments(params: TournamentQueryParams = {}) {
  return useApi<Tournament[]>(() => api.tournaments.list(params), FALLBACK, [JSON.stringify(params)])
}
