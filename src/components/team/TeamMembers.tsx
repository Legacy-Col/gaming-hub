import { useState } from 'react'
import type { TeamMember } from '@/types'

interface TeamMembersProps {
    members: TeamMember[]
    captainId: string
}

function MemberCard({ member, captainId }: { member: TeamMember; captainId: string }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            className="bg-gh-card border border-gh-border clip-sm transition-all duration-200 hover:border-gh-purple"
        >
            {/* Main row */}
            <div className="p-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gh-purple/20 border border-gh-purple flex items-center justify-center flex-shrink-0">
                    {member.avatarUrl ? (
                        <img
                            src={member.avatarUrl}
                            alt={member.username}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="font-bebas text-base text-gh-purple">
                            {member.username.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-rajdhani font-bold text-sm text-gh-text">
                            {member.username}
                        </span>
                        {member.id === captainId && (
                            <span className="font-mono text-[9px] tracking-[2px] uppercase bg-gh-gold/10 border border-gh-gold text-gh-gold px-2 py-0.5 rounded-sm">
                                Captain
                            </span>
                        )}
                    </div>
                    <div className="font-mono text-[10px] text-gh-faint tracking-wider mt-0.5">
                        Joined {new Date(member.joinedAt).toLocaleDateString('en-NG', {
                            day: '2-digit', month: 'short', year: 'numeric'
                        })}
                    </div>
                </div>

                {/* Scout button — only show if bio exists */}
                {member.bio && (
                    <button
                        onClick={() => setExpanded(o => !o)}
                        className={[
                            'font-mono text-[10px] tracking-[2px] uppercase px-3 py-1.5 border clip-sm transition-colors flex-shrink-0',
                            expanded
                                ? 'border-gh-purple text-gh-purple bg-gh-purple/10'
                                : 'border-gh-border text-gh-faint hover:border-gh-purple hover:text-gh-purple',
                        ].join(' ')}
                    >
                        {expanded ? 'HIDE ▲' : 'SCOUT ▼'}
                    </button>
                )}
            </div>

            {/* Expanded bio — player esports history */}
            {expanded && member.bio && (
                <div className="px-4 pb-4 border-t border-gh-border pt-3 ml-14">
                    <div className="font-mono text-[10px] tracking-[3px] uppercase text-gh-purple mb-2">
                        // PLAYER BIO
                    </div>
                    <p className="font-rajdhani text-sm text-gh-muted leading-relaxed">
                        {member.bio}
                    </p>
                </div>
            )}
        </div>
    )
}

export function TeamMembers({ members, captainId }: TeamMembersProps) {
    return (
        <div>
            {/* Section header */}
            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                    // ROSTER
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    TEAM MEMBERS
                    <span className="text-gh-faint text-xl ml-3">({members.length})</span>
                </h2>
                <p className="font-rajdhani text-xs text-gh-faint mt-1">
                    Click SCOUT to view a player's esports history and bio
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {members.map(member => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        captainId={captainId}
                    />
                ))}
            </div>
        </div>
    )
}