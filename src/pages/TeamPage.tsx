import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { TeamProfile } from '@/components/team/TeamProfile'
import { TeamMembers } from '@/components/team/TeamMembers'
import { CreateTeamForm } from '@/components/team/CreateTeamForm'
import { JoinTeamForm } from '@/components/team/JoinTeamForm'
import { useTeam } from '@/hooks/useTeam'

type ActiveTab = 'create' | 'join'

export function TeamPage() {
    const { team, isLoading } = useTeam()
    const [activeTab, setActiveTab] = useState<ActiveTab>('create')

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
                <div className="max-w-4xl mx-auto">

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : team ? (
                        /* ── Has a team — show profile + members ── */
                        <div className="flex flex-col gap-10">
                            <TeamProfile team={team} />
                            <TeamMembers
                                members={team.members}
                                captainId={team.captainId}
                            />
                        </div>
                    ) : (
                        /* ── No team — show create + join options ── */
                        <div className="flex flex-col gap-8">

                            {/* Page header */}
                            <div className="border-l-[3px] border-gh-purple pl-5">
                                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-2">
                                    // YOUR SQUAD
                                </div>
                                <h1 className="font-bebas text-gh-text leading-none"
                                    style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                                    BUILD YOUR TEAM<br />
                                    <span className="text-gh-muted"
                                        style={{ fontSize: 'clamp(20px, 3vw, 36px)' }}>
                                        CREATE OR JOIN A SQUAD
                                    </span>
                                </h1>
                            </div>

                            {/* Tab toggle */}
                            <div className="flex gap-2">
                                {([
                                    { key: 'create', label: 'CREATE A TEAM' },
                                    { key: 'join', label: 'JOIN A TEAM' },
                                ] as { key: ActiveTab; label: string }[]).map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={[
                                            'font-bebas tracking-widest text-sm px-6 py-2.5 border clip-sm transition-colors',
                                            activeTab === tab.key
                                                ? 'border-gh-purple text-gh-purple bg-gh-purple/10'
                                                : 'border-gh-border text-gh-muted hover:border-gh-purple hover:text-gh-purple',
                                        ].join(' ')}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Active form */}
                            {activeTab === 'create'
                                ? <CreateTeamForm />
                                : <JoinTeamForm />
                            }
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}