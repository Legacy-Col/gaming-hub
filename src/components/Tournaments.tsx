import { useTournaments } from '@/hooks/useTournaments'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { ErrorState } from './ui/ErrorState'
import { Button } from './ui/Button'
import { SectionHeader } from './Features'
import type { Tournament, TournamentStatus } from '@/types'
import { Link } from 'react-router-dom'

const statusStyles: Record<TournamentStatus, { label: string; classes: string }> = {
  live: { label: 'LIVE', classes: 'bg-[rgba(255,34,0,0.12)] text-gh-red border border-gh-red' },
  upcoming: { label: 'UPCOMING', classes: 'bg-[rgba(255,184,0,0.08)] text-gh-gold border border-gh-gold-dim' },
  completed: { label: 'ENDED', classes: 'bg-gh-card2 text-gh-faint border border-gh-border' },
}

function TournamentCard({ t }: { t: Tournament }) {
  const status = statusStyles[t.status]
  const fillPct = Math.round((t.registeredTeams / t.maxTeams) * 100)

  return (
    <div className="bg-gh-card border border-gh-border clip-lg p-5 sm:p-6 flex flex-col gap-4 hover:border-gh-red transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`font-mono text-[10px] tracking-[2px] px-2 py-0.5 rounded-sm ${status.classes}`}>
            {status.label}
          </span>
          <h3 className="font-bebas text-lg sm:text-xl tracking-wide text-gh-text mt-2 leading-tight">
            {t.title}
          </h3>
          <div className="font-rajdhani text-sm text-gh-muted mt-0.5">{t.game}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bebas text-2xl text-gh-red tracking-wide">{t.prizePool}</div>
          <div className="font-mono text-[10px] text-gh-faint uppercase tracking-wider">Prize Pool</div>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-3 text-center border-t border-gh-border pt-4">
        {[
          { label: 'Format', value: t.format },
          { label: 'Entry', value: t.entryFee ?? 'Free' },
          { label: 'Teams', value: `${t.registeredTeams}/${t.maxTeams}` },
        ].map(m => (
          <div key={m.label}>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint mb-0.5">{m.label}</div>
            <div className="font-rajdhani font-bold text-xs sm:text-sm text-gh-text capitalize">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Capacity bar */}
      <div>
        <div className="flex justify-between text-[10px] font-mono text-gh-faint mb-1.5">
          <span>Spots filled</span>
          <span>{fillPct}%</span>
        </div>
        <div className="h-1 bg-gh-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gh-red rounded-full transition-all duration-700"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <Button
        variant={t.status === 'live' ? 'primary' : 'outline'}
        fullWidth
        disabled={t.status === 'completed'}
      >
        {t.status === 'live' ? 'Join Now' : t.status === 'upcoming' ? 'Register' : 'View Results'}
      </Button>
    </div>
  )
}

export function Tournaments() {
  const { data: tournaments, loading, error, refetch } = useTournaments()

  return (
    <section id="tournaments" className="px-4 sm:px-6 lg:px-12 py-20 sm:py-28 bg-[#0a0a0a]">
      <SectionHeader
        label="ACTIVE TOURNAMENTS"
        heading="COMPETE & WIN"
        sub="CASH PRIZES + FORGE TOKENS"
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tournaments?.map(t => <TournamentCard key={t.id} t={t} />)}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link to='/tournaments'>
          <Button variant="outline">View All Tournaments</Button>
        </Link>
      </div>
    </section>
  )
}
