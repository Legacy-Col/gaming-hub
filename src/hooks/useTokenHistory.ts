import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { TokenTransaction } from '@/types'

const FALLBACK: TokenTransaction[] = [
    { id: '1', type: 'earned', amount: 150, reason: '1st Place — Lagos Open Season 3',   date: '2025-07-10T14:00:00Z' },
    { id: '2', type: 'earned', amount: 80,  reason: '2nd Place — West Africa FIFA Cup',   date: '2025-07-05T10:00:00Z' },
    { id: '3', type: 'spent',  amount: 90,  reason: 'Store Purchase — Tanjiro Hoodie',    date: '2025-07-01T08:00:00Z' },
    { id: '4', type: 'earned', amount: 10,  reason: 'Participation — CoD Domination',     date: '2025-06-28T16:00:00Z' },
    { id: '5', type: 'earned', amount: 40,  reason: '3rd Place — Street Fighter League',  date: '2025-06-20T12:00:00Z' },
]

export function useTokenHistory() {
    return useApi<TokenTransaction[]>(
        () => api.profile.tokenHistory(),
        FALLBACK,
    )
}