import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTournaments } from '@/hooks/useTournaments'
import type { TournamentStatus, GameTitle } from '@/types'
import { TournamentCard } from '@/components/tournaments/TournamentsCard'


const STATUSES: { label: string; value: TournamentStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Live', value: 'live' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' },
]

const GAMES: GameTitle[] = [
    'All', 'Valorant', 'FIFA 25', 'Call of Duty: MW3', 'eFootball', 'Street Fighter 6',
]

export function TournamentsPage() {
    const [status, setStatus] = useState<TournamentStatus | 'all'>('all')
    const [game, setGame] = useState<string>('All')

    const { data: tournaments, loading, error, refetch } = useTournaments(
        status === 'all' ? {} : { status }
    )

    const filtered = tournaments?.filter(t =>
        game === 'All' || t.game === game
    )

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">

                {/* Page header */}
                <div className="max-w-7xl mx-auto">
                    <div className="border-l-[3px] border-gh-purple pl-5 mb-10">
                        <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-2">
                            // COMPETE & WIN
                        </div>
                        <h1 className="font-bebas text-gh-text leading-none"
                            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
                            ALL TOURNAMENTS<br />
                            <span className="text-gh-muted" style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
                                FIND YOUR NEXT BATTLE
                            </span>
                        </h1>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* Status filter */}
                        <div className="flex gap-2 flex-wrap">
                            {STATUSES.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => setStatus(s.value)}
                                    className={[
                                        'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors duration-150',
                                        status === s.value
                                            ? 'border-gh-purple text-gh-purple bg-[rgba(123,47,190,0.12)]'
                                            : 'border-gh-border text-gh-muted hover:border-gh-purple hover:text-gh-purple',
                                    ].join(' ')}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* Game filter */}
                        <div className="flex gap-2 flex-wrap">
                            {GAMES.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setGame(g)}
                                    className={[
                                        'font-bebas tracking-widest text-sm px-4 py-1.5 border clip-sm transition-colors duration-150',
                                        game === g
                                            ? 'border-gh-gold text-gh-gold bg-[rgba(255,184,0,0.08)]'
                                            : 'border-gh-border text-gh-muted hover:border-gh-gold hover:text-gh-gold',
                                    ].join(' ')}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    {!loading && !error && (
                        <div className="font-mono text-[11px] text-gh-faint tracking-widest mb-6">
                            {filtered?.length ?? 0} TOURNAMENTS FOUND
                        </div>
                    )}

                    {/* Grid */}
                    {loading && <LoadingSpinner />}
                    {error && <ErrorState message={error} onRetry={refetch} />}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered?.map(t => (
                                <TournamentCard key={t.id} tournament={t} />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && filtered?.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-4xl mb-4">⚔</div>
                            <p className="font-bebas text-2xl text-gh-muted tracking-widest">
                                NO TOURNAMENTS FOUND
                            </p>
                            <p className="font-rajdhani text-sm text-gh-faint mt-2">
                                Try changing the filters above
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}