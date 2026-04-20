import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { TokenBadge } from '@/components/ui/TokenBadge'
import { TournamentBracket } from '@/components/tournaments/TournamentBracket'
import { RoundRobinTable } from '@/components/tournaments/RoundRobinTable'
import { RegistrationModal } from '@/components/tournaments/RegistrationModal'
import { useTournamentDetail } from '@/hooks/useTournamentDetails'


type Tab = 'bracket' | 'participants' | 'rules'

const statusStyles = {
    live: { label: 'LIVE', classes: 'bg-[rgba(255,34,0,0.12)] text-gh-red border border-gh-red' },
    upcoming: { label: 'UPCOMING', classes: 'bg-[rgba(123,47,190,0.12)] text-gh-purple border border-gh-purple' },
    completed: { label: 'ENDED', classes: 'bg-gh-card2 text-gh-faint border border-gh-border' },
}

export function TournamentDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { data: tournament, loading, error, refetch } = useTournamentDetail(id ?? '1')
    const [activeTab, setActiveTab] = useState<Tab>('bracket')
    const [showModal, setShowModal] = useState(false)
    const [registered, setRegistered] = useState(false)

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gh-bg flex items-center justify-center">
                <LoadingSpinner />
            </div>
            <Footer />
        </>
    )

    if (error || !tournament) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gh-bg flex items-center justify-center">
                <ErrorState message={error ?? 'Tournament not found'} onRetry={refetch} />
            </div>
            <Footer />
        </>
    )

    const status = statusStyles[tournament.status]
    const fillPct = Math.round((tournament.registeredTeams / tournament.maxTeams) * 100)
    const tabs: { label: string; value: Tab }[] = [
        { label: tournament.format === 'bracket' ? 'BRACKET' : 'STANDINGS', value: 'bracket' },
        { label: 'PARTICIPANTS', value: 'participants' },
        { label: 'RULES', value: 'rules' },
    ]

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg pt-20 pb-16">

                {/* Hero banner */}
                <div className="relative overflow-hidden border-b border-gh-border">
                    {/* Grid background */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
                        <svg className="w-full h-full">
                            <defs>
                                <pattern id="td-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7B2FBE" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#td-grid)" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(123,47,190,0.06) 0%, transparent 70%)' }} />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
                        {/* Back link */}
                        <Link to="/tournaments"
                            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-gh-muted hover:text-gh-purple transition-colors mb-6">
                            ← All Tournaments
                        </Link>

                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Left — tournament info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`font-mono text-[10px] tracking-[2px] px-2 py-0.5 rounded-sm ${status.classes}`}>
                                        {status.label}
                                    </span>
                                    <span className="font-mono text-[10px] text-gh-faint tracking-wider">
                                        {tournament.game}
                                    </span>
                                </div>

                                <h1 className="font-bebas text-gh-text leading-none mb-4"
                                    style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                                    {tournament.title}
                                </h1>

                                <p className="font-rajdhani text-gh-muted text-base leading-relaxed max-w-xl mb-6">
                                    {tournament.description}
                                </p>

                                {/* Stats row */}
                                <div className="flex flex-wrap gap-6">
                                    {[
                                        { label: 'Prize Pool', value: tournament.prizePool, color: 'text-gh-red' },
                                        { label: 'Entry Fee', value: tournament.entryFee ?? 'Free', color: 'text-gh-text' },
                                        { label: 'Format', value: tournament.format, color: 'text-gh-text' },
                                        { label: 'Teams', value: `${tournament.registeredTeams}/${tournament.maxTeams}`, color: 'text-gh-text' },
                                    ].map(s => (
                                        <div key={s.label}>
                                            <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-1">{s.label}</div>
                                            <div className={`font-bebas text-xl tracking-wide capitalize ${s.color}`}>{s.value}</div>
                                        </div>
                                    ))}
                                    {tournament.tokenCost && (
                                        <div>
                                            <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-1">Token Entry</div>
                                            <TokenBadge amount={tournament.tokenCost} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right — register card */}
                            <div className="w-full lg:w-72 bg-gh-card border border-gh-border p-6 clip-lg flex-shrink-0">
                                {/* Capacity bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between font-mono text-[10px] text-gh-faint mb-2">
                                        <span>Spots filled</span>
                                        <span>{fillPct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gh-border rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gh-purple rounded-full transition-all duration-700"
                                            style={{ width: `${fillPct}%` }}
                                        />
                                    </div>
                                    <div className="font-mono text-[10px] text-gh-faint mt-2 text-right">
                                        {tournament.maxTeams - tournament.registeredTeams} spots remaining
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="flex flex-col gap-2 mb-6 border-t border-gh-border pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-[10px] text-gh-faint tracking-wider">STARTS</span>
                                        <span className="font-rajdhani font-semibold text-sm text-gh-text">
                                            {new Date(tournament.startDate).toLocaleDateString('en-NG', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    {tournament.endDate && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-mono text-[10px] text-gh-faint tracking-wider">ENDS</span>
                                            <span className="font-rajdhani font-semibold text-sm text-gh-text">
                                                {new Date(tournament.endDate).toLocaleDateString('en-NG', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Register button */}
                                {registered ? (
                                    <div className="text-center py-3 bg-[rgba(34,197,94,0.08)] border border-green-500">
                                        <p className="font-bebas text-green-500 tracking-widest text-lg">
                                            ✓ REGISTERED
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        disabled={tournament.status === 'completed'}
                                        className="btn-primary w-full font-bebas tracking-widest text-lg py-3"
                                    >
                                        {tournament.status === 'live' && 'JOIN NOW'}
                                        {tournament.status === 'upcoming' && 'REGISTER'}
                                        {tournament.status === 'completed' && 'TOURNAMENT ENDED'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
                    {/* Tabs */}
                    <div className="flex gap-1 border-b border-gh-border mb-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={[
                                    'font-bebas tracking-widest text-sm px-5 py-3 border-b-2 transition-colors duration-150',
                                    activeTab === tab.value
                                        ? 'border-gh-purple text-gh-purple'
                                        : 'border-transparent text-gh-muted hover:text-gh-text',
                                ].join(' ')}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Bracket / Standings */}
                    {activeTab === 'bracket' && (
                        <div>
                            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                                    // {tournament.format === 'bracket' ? 'SINGLE ELIMINATION' : 'ROUND ROBIN'}
                                </div>
                                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                                    {tournament.format === 'bracket' ? 'TOURNAMENT BRACKET' : 'STANDINGS TABLE'}
                                </h2>
                            </div>
                            {tournament.format === 'bracket'
                                ? <TournamentBracket matches={tournament.matches} />
                                : <RoundRobinTable standings={tournament.standings} />
                            }
                        </div>
                    )}

                    {/* Participants */}
                    {activeTab === 'participants' && (
                        <div>
                            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                                    // REGISTERED
                                </div>
                                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                                    PARTICIPANTS ({tournament.participants.length})
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {tournament.participants.map((p, i) => (
                                    <div
                                        key={p.id}
                                        className="bg-gh-card border border-gh-border px-4 py-3 flex items-center gap-3 clip-sm hover:border-gh-purple transition-colors"
                                    >
                                        <span className="font-bebas text-2xl text-gh-faint w-8">{i + 1}</span>
                                        <div>
                                            <div className="font-rajdhani font-bold text-sm text-gh-text">{p.name}</div>
                                            <div className="font-mono text-[10px] text-gh-faint tracking-wider">[{p.tag}]</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rules */}
                    {activeTab === 'rules' && (
                        <div>
                            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                                    // GUIDELINES
                                </div>
                                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                                    TOURNAMENT RULES
                                </h2>
                            </div>
                            <div className="bg-gh-card border border-gh-border p-6 clip-lg flex flex-col gap-4">
                                {tournament.rules.map((rule, i) => (
                                    <div key={i} className="flex items-start gap-4 border-b border-gh-border pb-4 last:border-0 last:pb-0">
                                        <span className="font-bebas text-2xl text-gh-purple w-8 flex-shrink-0">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p className="font-rajdhani text-base text-gh-muted leading-relaxed font-medium">
                                            {rule}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Registration modal */}
            {showModal && (
                <RegistrationModal
                    tournamentId={tournament.id}
                    tournamentTitle={tournament.title}
                    entryFee={tournament.entryFee}
                    tokenCost={tournament.tokenCost}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false)
                        setRegistered(true)
                    }}
                />
            )}

            <Footer />
        </>
    )
}