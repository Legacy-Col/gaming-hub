import { useTeams } from '@/hooks/useTeams'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { TokenBadge } from '@/components/ui/TokenBadge'

export function TeamStats() {
    const { data: teams, loading, error, refetch } = useTeams({ sortBy: 'points' })

    const trendStyle = {
        up: { icon: '▲', color: 'text-green-500' },
        down: { icon: '▼', color: 'text-gh-red' },
        stable: { icon: '—', color: 'text-gh-faint' },
    }

    return (
        <div>
            {/* Section header */}
            <div className="border-l-[3px] border-gh-gold pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-gold mb-1">
                    // LEADERBOARD
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    TEAM RANKINGS
                </h2>
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorState message={error} onRetry={refetch} />}

            {!loading && !error && (
                <div className="bg-gh-card border border-gh-border overflow-hidden">
                    {/* Table header */}
                    <div
                        className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border"
                        style={{ gridTemplateColumns: '36px 1fr 64px 80px 90px', gap: '8px' }}
                    >
                        {['#', 'Team', 'Wins', 'Points', 'Tokens'].map((h, i) => (
                            <span key={h} className={`font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold ${i > 1 ? 'text-right' : ''}`}>
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* Rows */}
                    {teams?.map((t, i) => {
                        const trend = trendStyle[t.trend]
                        const rankColor = t.rank === 1 ? 'text-gh-gold'
                            : t.rank === 2 ? 'text-[#aaaaaa]'
                                : t.rank === 3 ? 'text-[#cd7f32]'
                                    : 'text-gh-faint'

                        return (
                            <div
                                key={t.id}
                                className="grid items-center px-4 py-3 border-b border-gh-border hover:bg-gh-card2 transition-colors duration-150"
                                style={{ gridTemplateColumns: '36px 1fr 64px 80px 90px', gap: '8px', animationDelay: `${i * 0.07}s` }}
                            >
                                <span className={`font-bebas text-xl ${rankColor}`}>{t.rank}</span>
                                <div>
                                    <div className="font-rajdhani font-bold text-sm text-gh-text">
                                        {t.name}{' '}
                                        <span className="text-gh-faint text-xs">[{t.tag}]</span>
                                    </div>
                                    <div className="font-mono text-[10px] text-gh-muted mt-0.5">{t.game}</div>
                                </div>
                                <span className="font-rajdhani font-bold text-gh-red text-sm text-right">{t.wins}W</span>
                                <span className="font-mono text-xs text-gh-text text-right">{t.points.toLocaleString()}</span>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <TokenBadge amount={t.tokens} className="text-[10px] px-1.5 py-0.5" />
                                    <span className={`font-mono text-xs ${trend.color}`}>{trend.icon}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}