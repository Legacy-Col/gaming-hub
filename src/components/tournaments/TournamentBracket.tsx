import type { Match } from '@/types'

interface TournamentBracketProps {
    matches: Match[]
}

function MatchCard({ match }: { match: Match }) {
    const isComplete = match.winner !== null

    return (
        <div className="bg-gh-card border border-gh-border w-48 clip-sm">
            {/* Team A */}
            <div className={[
                'flex items-center justify-between px-3 py-2 border-b border-gh-border',
                match.winner === match.teamA?.id ? 'bg-[rgba(123,47,190,0.12)]' : '',
            ].join(' ')}>
                <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-mono text-[10px] tracking-wider ${match.winner === match.teamA?.id ? 'text-gh-purple' : 'text-gh-faint'}`}>
                        {match.teamA?.tag ?? '???'}
                    </span>
                    <span className="font-rajdhani font-semibold text-xs text-gh-text truncate">
                        {match.teamA?.name ?? 'TBD'}
                    </span>
                </div>
                {isComplete && (
                    <span className={`font-bebas text-base ml-2 ${match.winner === match.teamA?.id ? 'text-gh-purple' : 'text-gh-faint'}`}>
                        {match.teamA?.score ?? 0}
                    </span>
                )}
            </div>

            {/* Team B */}
            <div className={[
                'flex items-center justify-between px-3 py-2',
                match.winner === match.teamB?.id ? 'bg-[rgba(123,47,190,0.12)]' : '',
            ].join(' ')}>
                <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-mono text-[10px] tracking-wider ${match.winner === match.teamB?.id ? 'text-gh-purple' : 'text-gh-faint'}`}>
                        {match.teamB?.tag ?? '???'}
                    </span>
                    <span className="font-rajdhani font-semibold text-xs text-gh-text truncate">
                        {match.teamB?.name ?? 'TBD'}
                    </span>
                </div>
                {isComplete && (
                    <span className={`font-bebas text-base ml-2 ${match.winner === match.teamB?.id ? 'text-gh-purple' : 'text-gh-faint'}`}>
                        {match.teamB?.score ?? 0}
                    </span>
                )}
            </div>

            {/* Match time */}
            {match.scheduledAt && (
                <div className="px-3 py-1 border-t border-gh-border bg-gh-card2">
                    <span className="font-mono text-[9px] text-gh-faint tracking-wider">
                        {new Date(match.scheduledAt).toLocaleDateString('en-NG', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                    </span>
                </div>
            )}
        </div>
    )
}

export function TournamentBracket({ matches }: TournamentBracketProps) {
    // Group matches by round
    const rounds = matches.reduce<Record<number, Match[]>>((acc, match) => {
        if (!acc[match.round]) acc[match.round] = []
        acc[match.round].push(match)
        return acc
    }, {})

    const roundNumbers = Object.keys(rounds).map(Number).sort()

    const roundLabels: Record<number, string> = {
        [roundNumbers.length]: 'FINAL',
        [roundNumbers.length - 1]: 'SEMI FINALS',
        [roundNumbers.length - 2]: 'QUARTER FINALS',
    }

    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex gap-8 min-w-max">
                {roundNumbers.map(round => (
                    <div key={round} className="flex flex-col gap-6">
                        {/* Round label */}
                        <div className="font-mono text-[10px] tracking-[3px] uppercase text-gh-purple text-center">
                            {roundLabels[round] ?? `ROUND ${round}`}
                        </div>

                        {/* Matches in this round */}
                        <div className="flex flex-col justify-around gap-8 flex-1">
                            {rounds[round].map(match => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}