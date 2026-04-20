import { Link } from 'react-router-dom'
import type { Tournament } from '@/types'

interface TournamentCardProps {
    tournament: Tournament
    featured?: boolean
}

const statusStyles = {
    live: { label: 'LIVE', classes: 'bg-[rgba(255,34,0,0.12)] text-gh-red border border-gh-red' },
    upcoming: { label: 'UPCOMING', classes: 'bg-[rgba(123,47,190,0.12)] text-gh-purple border border-gh-purple' },
    completed: { label: 'ENDED', classes: 'bg-gh-card2 text-gh-faint border border-gh-border' },
}

const formatLabel = {
    'bracket': 'Single Elimination',
    'round-robin': 'Round Robin',
    'league': 'League',
}

export function TournamentCard({ tournament: t, featured = false }: TournamentCardProps) {
    const status = statusStyles[t.status]
    const fillPct = Math.round((t.registeredTeams / t.maxTeams) * 100)

    return (
        <Link to={`/tournaments/${t.id}`} className="no-underline block">
            <div className={[
                'bg-gh-card border border-gh-border flex flex-col gap-4 transition-all duration-200',
                'hover:border-gh-purple hover:-translate-y-1',
                featured ? 'p-6 sm:p-8 clip-lg' : 'p-5 clip-md',
            ].join(' ')}>

                {/* Top row — status + prize */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <span className={`font-mono text-[10px] tracking-[2px] px-2 py-0.5 rounded-sm ${status.classes}`}>
                            {status.label}
                        </span>
                        <h3 className={[
                            'font-bebas tracking-wide text-gh-text mt-2 leading-tight',
                            featured ? 'text-2xl sm:text-3xl' : 'text-xl',
                        ].join(' ')}>
                            {t.title}
                        </h3>
                        <div className="font-rajdhani text-sm text-gh-muted mt-0.5">
                            {t.game}
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className={`font-bebas text-gh-red tracking-wide ${featured ? 'text-3xl' : 'text-2xl'}`}>
                            {t.prizePool}
                        </div>
                        <div className="font-mono text-[10px] text-gh-faint uppercase tracking-wider">
                            Prize Pool
                        </div>
                    </div>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-3 gap-3 text-center border-t border-gh-border pt-4">
                    {[
                        { label: 'Format', value: formatLabel[t.format] ?? t.format },
                        { label: 'Entry', value: t.entryFee ?? 'Free' },
                        { label: 'Teams', value: `${t.registeredTeams}/${t.maxTeams}` },
                    ].map(m => (
                        <div key={m.label}>
                            <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-0.5">
                                {m.label}
                            </div>
                            <div className="font-rajdhani font-bold text-xs sm:text-sm text-gh-text capitalize">
                                {m.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Capacity bar */}
                <div>
                    <div className="flex justify-between font-mono text-[10px] text-gh-faint mb-1.5">
                        <span>Spots filled</span>
                        <span>{fillPct}%</span>
                    </div>
                    <div className="h-1 bg-gh-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gh-purple rounded-full transition-all duration-700"
                            style={{ width: `${fillPct}%` }}
                        />
                    </div>
                </div>

                {/* CTA */}
                <div className={`font-bebas tracking-widest text-center py-2.5 transition-colors duration-150 ${t.status === 'completed'
                    ? 'text-gh-faint border border-gh-border'
                    : 'bg-gh-purple text-white clip-sm hover:bg-gh-purple-dim'
                    }`}>
                    {t.status === 'live' && 'JOIN NOW'}
                    {t.status === 'upcoming' && 'REGISTER'}
                    {t.status === 'completed' && 'VIEW RESULTS'}
                </div>

            </div>
        </Link>
    )
}