import { Link } from 'react-router-dom'
import { useTournaments } from '@/hooks/useTournaments'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function FeaturedTournament() {
    const { data: tournaments, loading } = useTournaments({ status: 'live' })

    // Pick the first live tournament as featured
    const featured = tournaments?.[0]

    if (loading) return <LoadingSpinner />
    if (!featured) return null

    const fillPct = Math.round((featured.registeredTeams / featured.maxTeams) * 100)

    return (
        <section className="px-4 sm:px-6 lg:px-12 py-20 sm:py-28 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">

                {/* Section header */}
                <div className="border-l-[3px] border-gh-red pl-5 mb-10">
                    <div className="font-mono text-[11px] tracking-[3px] text-gh-red mb-2">
                        // FEATURED TOURNAMENT
                    </div>
                    <h2 className="font-bebas text-gh-text leading-none"
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                        HAPPENING NOW<br />
                        <span className="text-gh-muted" style={{ fontSize: 'clamp(20px, 3vw, 36px)' }}>
                            DON'T MISS OUT
                        </span>
                    </h2>
                </div>

                {/* Featured card */}
                <div className="relative overflow-hidden bg-gh-card border border-gh-red/40 clip-lg p-6 sm:p-10">

                    {/* Background glow */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(255,34,0,0.05) 0%, transparent 60%)' }} />

                    {/* Live pulse indicator */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-gh-red" />
                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-gh-red animate-ping opacity-75" />
                        </div>
                        <span className="font-mono text-[10px] tracking-[3px] text-gh-red uppercase">
                            Live Now
                        </span>
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">

                        {/* Left — main info */}
                        <div className="flex-1">
                            <div className="font-mono text-[11px] tracking-[3px] text-gh-muted mb-3 uppercase">
                                {featured.game}
                            </div>
                            <h3 className="font-bebas text-gh-text leading-none mb-4"
                                style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
                                {featured.title}
                            </h3>

                            {/* Stats row */}
                            <div className="flex flex-wrap gap-8 mb-8">
                                {[
                                    { label: 'Prize Pool', value: featured.prizePool, color: 'text-gh-red' },
                                    { label: 'Entry Fee', value: featured.entryFee ?? 'Free', color: 'text-gh-text' },
                                    { label: 'Format', value: featured.format, color: 'text-gh-text' },
                                    { label: 'Teams Left', value: `${featured.maxTeams - featured.registeredTeams} spots`, color: 'text-gh-gold' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-1">
                                            {s.label}
                                        </div>
                                        <div className={`font-bebas text-2xl tracking-wide capitalize ${s.color}`}>
                                            {s.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Capacity bar */}
                            <div className="max-w-sm mb-6">
                                <div className="flex justify-between font-mono text-[10px] text-gh-faint mb-1.5">
                                    <span>{featured.registeredTeams} teams registered</span>
                                    <span>{fillPct}%</span>
                                </div>
                                <div className="h-1.5 bg-gh-border rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gh-red rounded-full transition-all duration-700"
                                        style={{ width: `${fillPct}%` }}
                                    />
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-3">
                                <Link to={`/tournaments/${featured.id}`}>
                                    <button className="btn-primary font-bebas tracking-widest text-lg px-8 py-3">
                                        JOIN NOW
                                    </button>
                                </Link>
                                <Link to="/tournaments">
                                    <button className="btn-outline font-bebas tracking-widest text-lg px-8 py-3">
                                        VIEW ALL
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right — decorative bracket preview */}
                        <div className="hidden lg:flex flex-col gap-3 flex-shrink-0 opacity-40">
                            {[
                                ['ẸKỌ WOLVES', '2', true],
                                ['LAGOS LIONS', '0', false],
                            ].map(([name, score, winner]) => (
                                <div
                                    key={String(name)}
                                    className={`flex items-center justify-between gap-6 px-4 py-2.5 border w-52 ${winner ? 'border-gh-red bg-gh-red/5' : 'border-gh-border bg-gh-card2'
                                        }`}
                                >
                                    <span className="font-rajdhani font-bold text-sm text-gh-text truncate">
                                        {String(name)}
                                    </span>
                                    <span className={`font-bebas text-xl ${winner ? 'text-gh-red' : 'text-gh-faint'}`}>
                                        {String(score)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-center gap-2 pl-4 mt-1">
                                <div className="w-4 h-px bg-gh-border" />
                                <span className="font-mono text-[10px] text-gh-faint tracking-wider">SEMI-FINALS</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}