import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { PlatformStats } from '@/types'

const FALLBACK_STATS: PlatformStats = {
  activePlayers: 2400,
  tournamentsRun: 180,
  gameTitles: 12,
  totalPrizesNGN: 4200000,
}

export function useStats() {
  return useApi<PlatformStats>(() => api.stats.get(), FALLBACK_STATS)
}
