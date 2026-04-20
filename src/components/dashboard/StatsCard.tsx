import { useAuthContext } from '@/context/AuthContext'

export function StatsCards() {
    const { user } = useAuthContext()

    const stats = [
        { label: 'FORGE Tokens', value: `◈ ${user?.tokens ?? 0}`, color: 'text-gh-gold', border: 'border-gh-gold/30' },
        { label: 'Tournaments Won', value: '0', color: 'text-gh-purple', border: 'border-gh-purple/30' },
        { label: 'Team Rank', value: '—', color: 'text-gh-text', border: 'border-gh-border' },
        { label: 'Win Rate', value: '0%', color: 'text-gh-red', border: 'border-gh-red/30' },
    ]

    return (
        <div>
            {/* Section header */}
            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                    // OVERVIEW
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    YOUR STATS
                </h2>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className={`bg-gh-card border ${s.border} p-5 clip-md flex flex-col gap-2`}
                    >
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint">
                            {s.label}
                        </div>
                        <div className={`font-bebas text-3xl tracking-wide ${s.color}`}>
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}