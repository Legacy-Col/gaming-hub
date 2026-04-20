import { useApi } from './useApi'
import { api } from '@/lib/api'
import type { TournamentDetail } from '@/types'

const FALLBACK: TournamentDetail = {
    id: '1',
    title: 'Lagos Open Season 3',
    game: 'Valorant',
    status: 'live',
    prizePool: '₦200,000',
    entryFee: '₦2,000',
    tokenCost: 80,
    startDate: '2025-07-10T14:00:00Z',
    endDate: '2025-07-20T14:00:00Z',
    maxTeams: 16,
    registeredTeams: 14,
    format: 'bracket',
    description: 'The biggest Valorant tournament in Lagos. Top 16 teams battle it out in a single elimination bracket for the grand prize.',
    rules: [
        'Teams must have 5 players minimum',
        'All players must be registered on the platform',
        'Match results must be reported within 30 minutes',
        'No substitutions after the tournament starts',
        'Disputes must be raised within 10 minutes of match end',
    ],
    matches: [
        { id: 'm1', round: 1, matchNumber: 1, teamA: { id: '1', name: 'ẸKỌ WOLVES',   tag: 'EKW', score: 2 }, teamB: { id: '2', name: 'LAGOS LIONS',  tag: 'LGL', score: 0 }, winner: '1', scheduledAt: '2025-07-10T14:00:00Z' },
        { id: 'm2', round: 1, matchNumber: 2, teamA: { id: '3', name: 'ABUJA ACES',   tag: 'ABA', score: 1 }, teamB: { id: '4', name: 'KANO STRIKERS',tag: 'KNS', score: 2 }, winner: '4', scheduledAt: '2025-07-10T16:00:00Z' },
        { id: 'm3', round: 1, matchNumber: 3, teamA: { id: '5', name: 'PHC PREDATORS',tag: 'PHP', score: 2 }, teamB: { id: '6', name: 'ENUGU EAGLES', tag: 'ENG', score: 1 }, winner: '5', scheduledAt: '2025-07-11T14:00:00Z' },
        { id: 'm4', round: 1, matchNumber: 4, teamA: { id: '7', name: 'DELTA FORCE',  tag: 'DLT', score: null }, teamB: { id: '8', name: 'IBADAN IRON', tag: 'IBI', score: null }, winner: null, scheduledAt: '2025-07-11T16:00:00Z' },
        { id: 'm5', round: 2, matchNumber: 1, teamA: { id: '1', name: 'ẸKỌ WOLVES',   tag: 'EKW', score: null }, teamB: { id: '4', name: 'KANO STRIKERS',tag: 'KNS', score: null }, winner: null, scheduledAt: '2025-07-14T14:00:00Z' },
        { id: 'm6', round: 2, matchNumber: 2, teamA: { id: '5', name: 'PHC PREDATORS',tag: 'PHP', score: null }, teamB: null, winner: null, scheduledAt: '2025-07-14T16:00:00Z' },
        { id: 'm7', round: 3, matchNumber: 1, teamA: null, teamB: null, winner: null, scheduledAt: '2025-07-20T14:00:00Z' },
    ],
    standings: [],
    participants: [
        { id: '1', name: 'ẸKỌ WOLVES',    tag: 'EKW' },
        { id: '2', name: 'LAGOS LIONS',   tag: 'LGL' },
        { id: '3', name: 'ABUJA ACES',    tag: 'ABA' },
        { id: '4', name: 'KANO STRIKERS', tag: 'KNS' },
        { id: '5', name: 'PHC PREDATORS', tag: 'PHP' },
        { id: '6', name: 'ENUGU EAGLES',  tag: 'ENG' },
        { id: '7', name: 'DELTA FORCE',   tag: 'DLT' },
        { id: '8', name: 'IBADAN IRON',   tag: 'IBI' },
    ],
}

export function useTournamentDetail(id: string) {
    return useApi<TournamentDetail>(
        () => api.tournaments.get(id),
        FALLBACK,
        [id],
    )
}