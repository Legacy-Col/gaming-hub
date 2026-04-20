import { useTournaments } from '@/hooks/useTournaments'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Link } from 'react-router-dom'

export function ActiveTourney() {
    const { data: tournaments, loading, error, refetch } = useTournaments({ status: 'live' })

    return (
        <div>
            {/* Section header */}
            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                    // ACTIVE
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    YOUR TOURNAMENTS
                </h2>
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorState message={error} onRetry={refetch} />}

            {!loading && !error && tournaments?.length === 0 && (
                <div className="bg-gh-card border border-gh-border p-8 text-center clip-lg">
                    <p className="font-rajdhani text-gh-muted text-sm tracking-wider mb-4">
                        You haven't registered for any tournaments yet.
                    </p>
                    <Link to="/#tournaments">
                        <button className="btn-primary font-bebas tracking-widest text-base px-6 py-2">
                            BROWSE TOURNAMENTS
                        </button>
                    </Link>
                </div>
            )}

            {!loading && !error && tournaments && tournaments.length > 0 && (
                <div className="flex flex-col gap-3">
                    {tournaments.map(t => (
                        <div
                            key={t.id}
                            className="bg-gh-card border border-gh-border p-4 sm:p-5 flex items-center justify-between gap-4 clip-md hover:border-gh-purple transition-colors duration-200"
                        >
                            <div>
                                <div className="font-rajdhani font-bold text-base text-gh-text">
                                    {t.title}
                                </div>
                                <div className="font-mono text-[11px] text-gh-faint mt-1 tracking-wider">
                                    {t.game}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="font-bebas text-xl text-gh-red tracking-wide">
                                    {t.prizePool}
                                </span>
                                <span className="font-mono text-[10px] bg-[rgba(255,34,0,0.1)] border border-gh-red text-gh-red px-2 py-1 rounded-sm">
                                    LIVE
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}