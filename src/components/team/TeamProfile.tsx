import { useAuthContext } from '@/context/AuthContext'
import { useTeam } from '@/hooks/useTeam'
import { TokenBadge } from '@/components/ui/TokenBadge'
import type { TeamDetail } from '@/types'

interface TeamProfileProps {
    team: TeamDetail
}

const trendStyle = {
    up: { icon: '▲', color: 'text-green-500' },
    down: { icon: '▼', color: 'text-gh-red' },
    stable: { icon: '—', color: 'text-gh-faint' },
}

export function TeamProfile({ team }: TeamProfileProps) {
    const { user } = useAuthContext()
    const { leaveTeam, isLoading } = useTeam()
    const isCaptain = user?.id === team.captainId
    const trend = trendStyle[team.trend]

    return (
        <div className="flex flex-col gap-6">
            {/* Team banner */}
            <div className="bg-gh-card border border-gh-border clip-lg p-6 sm:p-8 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(123,47,190,0.06) 0%, transparent 60%)' }} />

                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                    {/* Team logo / initials */}
                    <div className="w-20 h-20 rounded-full bg-gh-purple/20 border-2 border-gh-purple flex items-center justify-center flex-shrink-0">
                        {team.logoUrl ? (
                            <img
                                src={team.logoUrl}
                                alt={team.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="font-bebas text-3xl text-gh-purple">
                                {team.tag}
                            </span>
                        )}
                    </div>

                    {/* Team info */}
                    <div className="flex-1">
                        <div className="font-mono text-[10px] tracking-[3px] text-gh-purple mb-1 uppercase">
                            {team.game}
                        </div>
                        <h1 className="font-bebas text-gh-text leading-none mb-1"
                            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                            {team.name}
                            <span className="text-gh-faint text-xl ml-3">[{team.tag}]</span>
                        </h1>
                        <p className="font-rajdhani text-gh-muted text-sm leading-relaxed mt-2 max-w-lg">
                            {team.description}
                        </p>

                        {/* Token badge */}
                        <div className="mt-3">
                            <TokenBadge amount={team.tokens} />
                        </div>
                    </div>

                    {/* Leave button — only for non-captains */}
                    {!isCaptain && (
                        <button
                            onClick={leaveTeam}
                            disabled={isLoading}
                            className="btn-outline font-bebas tracking-widest text-sm px-5 py-2 border-gh-red text-gh-red hover:bg-[rgba(255,34,0,0.08)] flex-shrink-0"
                        >
                            {isLoading ? 'LEAVING...' : 'LEAVE TEAM'}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Rank', value: `#${team.rank}`, color: 'text-gh-purple' },
                    { label: 'Wins', value: `${team.wins}W`, color: 'text-green-500' },
                    { label: 'Losses', value: `${team.losses}L`, color: 'text-gh-red' },
                    { label: 'Points', value: team.points.toLocaleString(), color: 'text-gh-text' },
                ].map((s, i) => (
                    <div key={i} className="bg-gh-card border border-gh-border p-4 clip-md">
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-2">
                            {s.label}
                        </div>
                        <div className={`font-bebas text-3xl tracking-wide ${s.color}`}>
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Trend + created */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${trend.color}`}>{trend.icon}</span>
                    <span className="font-mono text-[11px] text-gh-faint tracking-wider capitalize">
                        {team.trend === 'up' ? 'Trending Up' : team.trend === 'down' ? 'Trending Down' : 'Stable'}
                    </span>
                </div>
                <span className="font-mono text-[11px] text-gh-faint tracking-wider">
                    Created {new Date(team.createdAt).toLocaleDateString('en-NG', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })}
                </span>
            </div>
        </div>
    )
}