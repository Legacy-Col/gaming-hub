import { useTokenHistory } from '@/hooks/useTokenHistory'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'

export function TokenHistory() {
    const { data: history, loading, error, refetch } = useTokenHistory()

    const totalEarned = history?.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0) ?? 0
    const totalSpent = history?.filter(t => t.type === 'spent').reduce((sum, t) => sum + t.amount, 0) ?? 0

    return (
        <div>
            {/* Section header */}
            <div className="border-l-[3px] border-gh-gold pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-gold mb-1">
                    // TOKEN WALLET
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    FORGE TOKEN HISTORY
                </h2>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gh-card border border-gh-gold/30 p-4 clip-md">
                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-2">
                        Total Earned
                    </div>
                    <div className="font-bebas text-3xl text-gh-gold tracking-wide">
                        ◈ {totalEarned.toLocaleString()}
                    </div>
                </div>
                <div className="bg-gh-card border border-gh-red/30 p-4 clip-md">
                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-2">
                        Total Spent
                    </div>
                    <div className="font-bebas text-3xl text-gh-red tracking-wide">
                        ◈ {totalSpent.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Transaction list */}
            <div className="bg-gh-card border border-gh-border overflow-hidden">
                {/* Header */}
                <div className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border"
                    style={{ gridTemplateColumns: '1fr auto auto', gap: '16px' }}>
                    {['Transaction', 'Date', 'Amount'].map(h => (
                        <span key={h} className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold last:text-right">
                            {h}
                        </span>
                    ))}
                </div>

                {loading && <LoadingSpinner />}
                {error && <ErrorState message={error} onRetry={refetch} />}

                {!loading && !error && history?.map((t, i) => (
                    <div
                        key={t.id}
                        className="grid items-center px-4 py-3 border-b border-gh-border hover:bg-gh-card2 transition-colors duration-150"
                        style={{ gridTemplateColumns: '1fr auto auto', gap: '16px', animationDelay: `${i * 0.06}s` }}
                    >
                        {/* Reason */}
                        <div>
                            <div className="font-rajdhani font-semibold text-sm text-gh-text leading-snug">
                                {t.reason}
                            </div>
                            <div className={`font-mono text-[10px] tracking-wider mt-0.5 ${t.type === 'earned' ? 'text-green-500' : 'text-gh-red'}`}>
                                {t.type === 'earned' ? '▲ EARNED' : '▼ SPENT'}
                            </div>
                        </div>

                        {/* Date */}
                        <span className="font-mono text-[11px] text-gh-faint whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString('en-NG', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>

                        {/* Amount */}
                        <span className={`font-bebas text-lg tracking-wide text-right ${t.type === 'earned' ? 'text-green-500' : 'text-gh-red'}`}>
                            {t.type === 'earned' ? '+' : '-'}◈ {t.amount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}