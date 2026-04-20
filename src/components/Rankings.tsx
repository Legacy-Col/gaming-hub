import { useState } from 'react'
import { useTeams } from '@/hooks/useTeams'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { ErrorState } from './ui/ErrorState'
import { TokenBadge } from './ui/TokenBadge'
import { Button } from './ui/Button'
import type { Team, GameTitle } from '@/types'
import { Link } from 'react-router-dom'

const GAME_FILTERS: GameTitle[] = ['All', 'Valorant', 'FIFA 25', 'Call of Duty: MW3', 'eFootball', 'Street Fighter 6']

const RANK_COLORS: Record<number, string> = {
  1: 'text-gh-gold',
  2: 'text-[#aaaaaa]',
  3: 'text-[#cd7f32]',
}

const TREND_MAP: Record<Team['trend'], { icon: string; cls: string }> = {
  up: { icon: '▲', cls: 'text-green-400' },
  down: { icon: '▼', cls: 'text-gh-red' },
  stable: { icon: '—', cls: 'text-gh-muted' },
}

function RankRow({ team, index }: { team: Team; index: number }) {
  const trend = TREND_MAP[team.trend]
  return (
    <div
      className="grid items-center px-3 md:px-5 py-3 md:py-4 border-b border-gh-border
                 hover:bg-gh-card2 transition-colors duration-150 animate-rankIn"
      style={{
        gridTemplateColumns: '36px 1fr 60px 90px 110px',
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Rank */}
      <span className={`font-bebas text-xl md:text-2xl ${RANK_COLORS[team.rank] ?? 'text-gh-faint'}`}>
        {team.rank}
      </span>

      {/* Team info */}
      <div className="min-w-0">
        <div className="font-rajdhani font-bold text-sm md:text-base text-gh-text truncate">
          {team.name}
          <span className="text-gh-faint text-xs ml-2 hidden sm:inline">[{team.tag}]</span>
        </div>
        <div className="text-xs text-gh-muted truncate">{team.game}</div>
      </div>

      {/* Wins */}
      <span className="text-right text-gh-red font-bold text-sm">{team.wins}W</span>

      {/* Points */}
      <span className="text-right font-mono text-xs md:text-sm text-gh-text hidden sm:block">
        {team.points.toLocaleString()}
      </span>

      {/* Tokens + trend */}
      <div className="flex items-center justify-end gap-2">
        <TokenBadge amount={team.tokens} />
        <span className={`text-xs hidden md:inline ${trend.cls}`}>{trend.icon}</span>
      </div>
    </div>
  )
}

export function Rankings() {
  const [activeGame, setActiveGame] = useState<GameTitle>('All')
  const { data: teams, loading, error, refetch } = useTeams(
    activeGame === 'All' ? {} : { game: activeGame },
  )

  return (
    <section id="rankings" className="px-4 md:px-12 py-20 md:py-28">
      {/* Heading */}
      <div className="border-l-[3px] border-gh-gold pl-5 mb-10">
        <p className="section-label text-gh-gold">// LIVE LEADERBOARD</p>
        <h2 className="section-heading text-4xl md:text-5xl lg:text-6xl">
          TEAM RANKINGS<br />
          <span className="text-gh-muted">WHO RUNS THE ARENA?</span>
        </h2>
      </div>

      {/* Game filter pills — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {GAME_FILTERS.map(g => (
          <button
            key={g}
            onClick={() => setActiveGame(g)}
            className={[
              'flex-shrink-0 font-mono text-xs px-3 py-1.5 border transition-colors duration-150',
              activeGame === g
                ? 'border-gh-gold text-gh-gold bg-[rgba(255,184,0,0.08)]'
                : 'border-gh-border text-gh-muted hover:border-gh-faint',
            ].join(' ')}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gh-card border border-gh-border overflow-hidden">
        {/* Table header */}
        <div
          className="grid px-3 md:px-5 py-3 bg-gh-card2 border-b border-gh-border
                     text-[10px] md:text-xs tracking-[2px] uppercase text-gh-faint font-bold"
          style={{ gridTemplateColumns: '36px 1fr 60px 90px 110px' }}
        >
          <span>#</span>
          <span>Team</span>
          <span className="text-right">Wins</span>
          <span className="text-right hidden sm:block">Points</span>
          <span className="text-right">Tokens</span>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={refetch} />}
        {!loading && !error && teams?.map((t, i) => (
          <RankRow key={t.id} team={t} index={i} />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link to='/rankings'>
          <Button variant="outline">View Full Rankings</Button>
        </Link>
      </div>
    </section>
  )
}
