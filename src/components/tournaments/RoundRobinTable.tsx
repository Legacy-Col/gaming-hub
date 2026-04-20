import type { RoundRobinStanding } from '@/types'

interface RoundRobinTableProps {
    standings: RoundRobinStanding[]
}

export function RoundRobinTable({ standings }: RoundRobinTableProps) {
    if (standings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="font-rajdhani text-gh-muted text-sm tracking-wider">
                    Standings will appear once matches begin.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <div className="bg-gh-card border border-gh-border overflow-hidden min-w-[500px]">
                {/* Header */}
                <div
                    className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border"
                    style={{ gridTemplateColumns: '32px 1fr 60px 60px 60px 60px', gap: '8px' }}
                >
                    {['#', 'Team', 'P', 'W', 'L', 'PTS'].map((h, i) => (
                        <span
                            key={h}
                            className={`font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold ${i > 1 ? 'text-right' : ''}`}
                        >
                            {h}
                        </span>
                    ))}
                </div>

                {/* Rows */}
                {standings
                    .sort((a, b) => b.points - a.points)
                    .map((s, i) => (
                        <div
                            key={s.teamId}
                            className="grid items-center px-4 py-3 border-b border-gh-border hover:bg-gh-card2 transition-colors"
                            style={{ gridTemplateColumns: '32px 1fr 60px 60px 60px 60px', gap: '8px' }}
                        >
                            <span className={`font-bebas text-lg ${i === 0 ? 'text-gh-gold' : i === 1 ? 'text-[#aaa]' : i === 2 ? 'text-[#cd7f32]' : 'text-gh-faint'}`}>
                                {i + 1}
                            </span>
                            <div>
                                <div className="font-rajdhani font-bold text-sm text-gh-text">
                                    {s.teamName}{' '}
                                    <span className="text-gh-faint text-xs">[{s.teamTag}]</span>
                                </div>
                            </div>
                            <span className="font-mono text-xs text-gh-muted text-right">{s.played}</span>
                            <span className="font-mono text-xs text-green-500 text-right">{s.won}</span>
                            <span className="font-mono text-xs text-gh-red text-right">{s.lost}</span>
                            <span className="font-bebas text-base text-gh-purple text-right">{s.points}</span>
                        </div>
                    ))}
            </div>
        </div>
    )
}