import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { TokenBadge } from '@/components/ui/TokenBadge'
import { useTeams } from '@/hooks/useTeams'
import type { Team, GameTitle } from '@/types'

const GAMES: { label: string; value: GameTitle | 'all' }[] = [
    { label: 'All Games', value: 'all' },
    { label: 'Valorant', value: 'Valorant' },
    { label: 'FIFA 25', value: 'FIFA 25' },
    { label: 'Call of Duty: MW3', value: 'Call of Duty: MW3' },
    { label: 'eFootball', value: 'eFootball' },
    { label: 'Street Fighter 6', value: 'Street Fighter 6' },
]

const SORT_OPTIONS = [
    { label: 'Points', value: 'points' },
    { label: 'Wins', value: 'wins' },
    { label: 'Tokens', value: 'tokens' },
] as const

const trendStyle = {
    up: { icon: '▲', color: 'text-green-500' },
    down: { icon: '▼', color: 'text-gh-red' },
    stable: { icon: '—', color: 'text-gh-faint' },
}

const rankColor = (rank: number) =>
    rank === 1 ? 'text-gh-gold'
        : rank === 2 ? 'text-[#aaaaaa]'
            : rank === 3 ? 'text-[#cd7f32]'
                : 'text-gh-faint'

const medalBg = (rank: number) =>
    rank === 1 ? 'bg-gh-gold/10 border-gh-gold'
        : rank === 2 ? 'bg-[rgba(170,170,170,0.1)] border-[#aaaaaa]'
            : 'bg-[rgba(205,127,50,0.1)] border-[#cd7f32]'

// ── Podium ─────────────────────────────────────────────────────────────────────
function Podium({ teams }: { teams: Team[] }) {
    const top3 = teams.slice(0, 3)
    if (top3.length < 3) return null

    // Reorder for podium display: 2nd, 1st, 3rd
    const order = [top3[1], top3[0], top3[2]]
    const heights = ['h-24', 'h-32', 'h-20']
    const positions = ['2nd', '1st', '3rd']

    return (
        <div className="bg-gh-card border border-gh-border clip-lg p-6 sm:p-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,184,0,0.04) 0%, transparent 70%)' }} />

            <div className="relative z-10">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-gold mb-6">
                    // TOP 3 TEAMS
                </div>

                {/* Podium stands */}
                <div className="flex items-end justify-center gap-4">
                    {order.map((team, i) => (
                        <div key={team.id} className="flex flex-col items-center gap-3 flex-1 max-w-[160px]">
                            {/* Team info above stand */}
                            <div className="text-center">
                                <div className={`w-14 h-14 rounded-full border-2 ${medalBg(team.rank)} flex items-center justify-center mx-auto mb-2`}>
                                    <span className={`font-bebas text-lg ${rankColor(team.rank)}`}>
                                        {team.tag}
                                    </span>
                                </div>
                                <div className="font-rajdhani font-bold text-xs text-gh-text leading-tight">
                                    {team.name}
                                </div>
                                <div className="font-mono text-[10px] text-gh-faint mt-0.5">
                                    {team.game}
                                </div>
                                <div className={`font-bebas text-2xl tracking-wide mt-1 ${rankColor(team.rank)}`}>
                                    {team.points.toLocaleString()}
                                </div>
                                <div className="font-mono text-[9px] text-gh-faint">PTS</div>
                            </div>

                            {/* Podium stand */}
                            <div className={`w-full ${heights[i]} border border-gh-border flex items-center justify-center clip-sm ${i === 1
                                ? 'bg-gh-gold/10 border-gh-gold'
                                : 'bg-gh-card2'
                                }`}>
                                <span className={`font-bebas text-4xl ${rankColor(team.rank)}`}>
                                    {positions[i]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Stats bar ──────────────────────────────────────────────────────────────────
function StatsBar({ teams }: { teams: Team[] }) {
    const totalWins = teams.reduce((s, t) => s + t.wins, 0)
    const totalTokens = teams.reduce((s, t) => s + t.tokens, 0)
    const topGame = teams.reduce((acc, t) => {
        acc[t.game] = (acc[t.game] ?? 0) + 1
        return acc
    }, {} as Record<string, number>)
    const mostPlayed = Object.entries(topGame).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
                { label: 'Total Teams', value: teams.length.toString(), color: 'text-gh-purple' },
                { label: 'Total Wins', value: totalWins.toLocaleString(), color: 'text-green-500' },
                { label: 'Total Tokens', value: `◈ ${totalTokens.toLocaleString()}`, color: 'text-gh-gold' },
                { label: 'Top Game', value: mostPlayed, color: 'text-gh-text' },
            ].map((s, i) => (
                <div key={i} className="bg-gh-card border border-gh-border p-4 clip-md">
                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-2">
                        {s.label}
                    </div>
                    <div className={`font-bebas text-2xl tracking-wide truncate ${s.color}`}>
                        {s.value}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Table row ──────────────────────────────────────────────────────────────────
function TeamRow({ team, index }: { team: Team; index: number }) {
    const trend = trendStyle[team.trend]

    return (
        <div
            className="grid items-center px-4 py-3 border-b border-gh-border hover:bg-gh-card2 transition-colors duration-150"
            style={{
                gridTemplateColumns: '44px 1fr 80px 100px 110px 36px',
                gap: '8px',
                animationDelay: `${index * 0.05}s`,
            }}
        >
            {/* Rank */}
            <span className={`font-bebas text-2xl ${rankColor(team.rank)}`}>
                {team.rank}
            </span>

            {/* Team info */}
            <div className="min-w-0">
                <div className="font-rajdhani font-bold text-sm text-gh-text truncate">
                    {team.name}{' '}
                    <span className="text-gh-faint text-xs tracking-wider">[{team.tag}]</span>
                </div>
                <div className="font-mono text-[10px] text-gh-muted mt-0.5 truncate">
                    {team.game}
                </div>
            </div>

            {/* Wins */}
            <div className="text-right">
                <span className="font-rajdhani font-bold text-sm text-green-500">
                    {team.wins}W
                </span>
                <span className="font-rajdhani text-xs text-gh-faint ml-1">
                    {team.losses}L
                </span>
            </div>

            {/* Points */}
            <span className="font-mono text-xs text-gh-text text-right">
                {team.points.toLocaleString()} pts
            </span>

            {/* Tokens */}
            <div className="flex justify-end">
                <TokenBadge amount={team.tokens} className="text-[10px] px-2 py-0.5" />
            </div>

            {/* Trend */}
            <span className={`font-mono text-xs text-right ${trend.color}`}>
                {trend.icon}
            </span>
        </div>
    )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export function RankingsPage() {
    const [activeGame, setActiveGame] = useState<GameTitle | 'all'>('all')
    const [sortBy, setSortBy] = useState<'points' | 'wins' | 'tokens'>('points')

    const { data: teams, loading, error, refetch } = useTeams(
        activeGame === 'all' ? { sortBy } : { game: activeGame, sortBy }
    )

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">

                    {/* Page header */}
                    <div className="border-l-[3px] border-gh-gold pl-5">
                        <div className="font-mono text-[11px] tracking-[3px] text-gh-gold mb-2">
                            // GLOBAL LEADERBOARD
                        </div>
                        <h1 className="font-bebas text-gh-text leading-none"
                            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
                            TEAM RANKINGS<br />
                            <span className="text-gh-muted"
                                style={{ fontSize: 'clamp(20px, 3vw, 36px)' }}>
                                WHO RUNS THE ARENA?
                            </span>
                        </h1>
                    </div>

                    {loading && <LoadingSpinner />}
                    {error && <ErrorState message={error} onRetry={refetch} />}

                    {!loading && !error && teams && (
                        <>
                            {/* Stats bar */}
                            <StatsBar teams={teams} />

                            {/* Podium */}
                            <Podium teams={teams} />

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Game tabs */}
                                <div className="flex gap-2 flex-wrap">
                                    {GAMES.map(g => (
                                        <button
                                            key={g.value}
                                            onClick={() => setActiveGame(g.value)}
                                            className={[
                                                'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors',
                                                activeGame === g.value
                                                    ? 'border-gh-gold text-gh-gold bg-gh-gold/8'
                                                    : 'border-gh-border text-gh-muted hover:border-gh-gold hover:text-gh-gold',
                                            ].join(' ')}
                                        >
                                            {g.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Sort */}
                                <div className="flex gap-2 sm:ml-auto">
                                    {SORT_OPTIONS.map(s => (
                                        <button
                                            key={s.value}
                                            onClick={() => setSortBy(s.value)}
                                            className={[
                                                'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors',
                                                sortBy === s.value
                                                    ? 'border-gh-purple text-gh-purple bg-gh-purple/10'
                                                    : 'border-gh-border text-gh-muted hover:border-gh-purple hover:text-gh-purple',
                                            ].join(' ')}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-gh-card border border-gh-border overflow-hidden">
                                {/* Table header */}
                                <div
                                    className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border"
                                    style={{
                                        gridTemplateColumns: '44px 1fr 80px 100px 110px 36px',
                                        gap: '8px',
                                    }}
                                >
                                    {['#', 'Team', 'Record', 'Points', 'Tokens', ''].map((h, i) => (
                                        <span
                                            key={i}
                                            className={`font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold ${i > 1 ? 'text-right' : ''}`}
                                        >
                                            {h}
                                        </span>
                                    ))}
                                </div>

                                {/* Rows */}
                                {teams.map((team, i) => (
                                    <TeamRow key={team.id} team={team} index={i} />
                                ))}

                                {/* Empty state */}
                                {teams.length === 0 && (
                                    <div className="text-center py-16">
                                        <p className="font-bebas text-2xl text-gh-muted tracking-widest">
                                            NO TEAMS FOUND
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Results count */}
                            <div className="font-mono text-[11px] text-gh-faint tracking-widest text-center">
                                SHOWING {teams.length} TEAMS
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}